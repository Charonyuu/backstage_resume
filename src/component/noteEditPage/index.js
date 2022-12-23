import React, { useEffect, useRef, useState } from 'react'
import styles from "./index.module.scss"
import { Input,SmallBtn} from '../things'
import { useLocation } from 'react-router-dom'
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineAdd } from "react-icons/md";

import { useQuill } from 'react-quilljs';
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useAuth } from "../../context/AuthContext"
import { useHistory } from 'react-router-dom';

export default function ExperienceEditPage() {
  const [input,setInput] =useState({
      Date:'',intro:'',id:null,
      title:'',keyword:[],
    })
    const [content,setContent] = useState('')
  const location = useLocation();

  useEffect(()=>{
    const state_data = location.state
    if (!state_data) return;
    setInput(state_data)
    setContent(state_data.content)
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return  (
    <div className={styles.note}>
        <h1>筆記</h1>
        <div className={styles.form}>
          <Input 
            title={'標題'} 
            value={input.title} 
            func={(e) => setInput({ ...input, title: e.target.value })} 
            placeholder={"請輸入標題"}
          />
          <Input 
            title={'簡介'} 
            value={input.intro} 
            func={(e) => setInput({ ...input, intro: e.target.value })} 
            placeholder={"請輸入簡介"}
          />
          <QuillContainer content={content} setContent={setContent}/>
          <KeywordContainer input={input} setInput={setInput} />
          <ButtonGroup input={input} content={content}/>
        </div>
    </div>
  )
}



const QuillContainer = ({content,setContent}) =>{
  const { quill,quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(content);
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
      quill.on('text-change', (delta, oldDelta, source) => {
        setContent(quillRef.current.firstChild.innerHTML)
      });
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill]);
  const insertToEditor = (url) => {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', url);
  };

  const saveToServer = async (file) => {
    const storageRef = ref(storage, `image/note/${file.name}`);
    await uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        insertToEditor(url);
      });
    });
  };

  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };

  return(
    <div className={styles.content_container}>
      <p>內容：</p>
      <div className={styles.quill_container}>
        <div ref={quillRef} />
      </div>
    </div>  
  )
}

const KeywordContainer = ({input,setInput}) =>{
    const keywordRef = useRef(null)

    const handle_add_keyword = () =>{
      if(!keywordRef.current.value) return;
      const temp = [...input.keyword]
      temp.push(keywordRef.current.value)
      keywordRef.current.value = ''
      setInput({ ...input, keyword: temp })
    }

    const handle_delete_keyword = (keyword_name) =>{
      const temp = [...input.keyword]
      const result = temp.filter((keyword)=> keyword !== keyword_name)
      setInput({ ...input, keyword: result })
    }
  return(
    <>
      <div className={styles.keywordInput}>
        <input ref={keywordRef} placeholder='請輸入關鍵字'/>
        <MdOutlineAdd onClick={handle_add_keyword}/>
      </div>
      
      <p className={styles.keyword_title}>關鍵字:</p>
      <div className={styles.keyword_list}>
        {input.keyword.length === 0 ? <p>暫無關鍵字</p> : null}
        {input.keyword.map((item,idx) =>
          <div className={styles.keyword} key={idx}>
            {item}
            <AiFillDelete onClick={()=>handle_delete_keyword(item)}/>
          </div>
        )}
      </div>
    </>
  )
}

const ButtonGroup = ({input,content}) =>{
  const {update_User_Collection_Data} = useAuth()
  const history = useHistory()
  const saveData = () => {
    if (input.id) return update_User_Collection_Data('note','note_list',input.id,input);

    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    const temp = {...input,id: new Date().getTime().toString(), Date:[year, month, day].join('-'),content}
    update_User_Collection_Data('note','note_list',temp.id,temp)
  }
  const goBack = () =>{
    history.push('/note')
  }
  console.log(input.keyword)
  return(
    <div className={styles.button_row}>
      <SmallBtn title='取消' func={goBack}/>
      <SmallBtn title='儲存' func={saveData}/>
    </div>
  )
}
