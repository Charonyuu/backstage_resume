import React, { useEffect, useRef, useState } from 'react'
import styles from "./index.module.scss"
import { useAuth } from "../../context/AuthContext"
import { Input,RowInput,SmallBtn ,Textarea ,Modal} from '../things'
import { useLocation } from 'react-router-dom'
import { AiOutlineRight,AiFillDelete } from "react-icons/ai";

import {ReactComponent as Upload} from '../../assets/upload_icon.svg';
import {ReactComponent as Delete} from '../../assets/delete_icon.svg';

//storage
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export default function PortfilioEditPage() {
  const {update_User_Collection_Data} = useAuth()

  const [data,setData] = useState()
  const [modalOpen,setModalOpen] = useState(false)
  const [input,setInput] =useState({
      picture_list:[],
      portifilio_url:'',
      zh_portfilio_name:'',en_portfilio_name:'',
      zh_introduction:'',en_introduction:'',
      tools:[],
    })
  const [isSetting,setIsSetting] = useState(false)

  const handle_reset = () =>{
    setInput(data)
    setIsSetting(false)
  }

  const handle_save = ()=>{
    update_User_Collection_Data('portfilio','portfilio_list',input.zh_portfilio_name,input)
    setIsSetting(false)
  }

  const handle_delete_tool = (tool_name) =>{
    const yes = window.confirm('你確定嗎？');
    if (!yes) return;
    const temp = [...input.tools]
    const result = temp.filter((tool)=> tool !== tool_name)
    setInput({ ...input, tools: result })
  }

  const location = useLocation()
  useEffect(()=>{
    const state_data = location.state || {
      picture_list:[],
      portifilio_url:'',
      zh_portfilio_name:'',en_portfilio_name:'',
      zh_introduction:'',en_introduction:'',
      tools:[],
    }
    setData(state_data)
    setInput(state_data)
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  return  (
    <div className={styles.home}>
        <h1>工作經歷修改</h1>
        <div className={styles.form}>
          <PictureList input={input} setInput={setInput} isSetting={isSetting}/>
          <Input title={'作品集網址'} setting={isSetting} value={input.portifilio_url} func={(e) => setInput({ ...input, portifilio_url: e.target.value })} placeholder={"輸入網址"}/>

          <div className={styles.row}>
            <RowInput title={'作品中文名稱'} setting={isSetting} value={input.zh_portfilio_name} func={(e) => setInput({ ...input, zh_portfilio_name: e.target.value })} placeholder={"輸入名稱"}/>
            <RowInput title={'作品英文名稱'} setting={isSetting} value={input.en_portfilio_name} func={(e) => setInput({ ...input, en_portfilio_name: e.target.value })} placeholder={"輸入名稱"}/>
          </div>
          <Textarea title={'作品中文簡介'} setting={isSetting} value={input.zh_introduction} func={(e) => setInput({ ...input, zh_introduction: e.target.value })} placeholder={"輸入內容..."}/>
          <Textarea title={'作品英文簡介'} setting={isSetting} value={input.en_introduction} func={(e) => setInput({ ...input, en_introduction: e.target.value })} placeholder={"輸入內容..."}/>
          <div className={styles.tool_title}>
            使用工具
            {isSetting && <AiOutlineRight onClick={()=>setModalOpen(true)}/>}
          </div>
          <div className={styles.tool_list}>
            {input.tools.map((tool,idx) =>
              <div className={styles.tool} key={idx}>
                {tool}
                {isSetting &&<AiFillDelete onClick={()=>handle_delete_tool(tool)}/>}
              </div>
            )}
          </div>

          <div className={styles.button_row}>
            {!isSetting ?
              <SmallBtn title='修改' func={()=>setIsSetting(true)}/>
            :
            <>
              <SmallBtn title='取消' func={handle_reset}/>
              <SmallBtn title='儲存' func={handle_save}/>
            </>
             }
          </div>

          {modalOpen && <ToolModal input={input} setInput={setInput} setModalOpen={setModalOpen}/>}
        </div>
    </div>
  )
}

const PictureList = ({input,setInput,isSetting}) =>{
  const imgUpload_ref = useRef(null)

  const handleDeletePic = async(name) =>{
    const temp_url = [...input.picture_list]
    const newArray = temp_url.filter((pic)=> pic.name !== name)
    setInput({ ...input, picture_list: newArray })
    const picRef = ref(storage, `image/portifilio/${name}`);
    await deleteObject(picRef).then(()=>{
      alert('刪除成功')
    }).catch((error) => {
      alert(error)
    });
  }

  //上傳圖片過程
  const [percent, setPercent] = useState(0);
  function handleChange(event) {
    const file = event.target.files[0]
    const storageRef = ref(storage, `image/portifilio/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",(snapshot) => {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setPercent(percent);
    },
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        const temp_url = [...input.picture_list]
        temp_url.push({name: file.name, url}) 
        setInput({ ...input, picture_list: temp_url })
      });
    });
  }
  
  return(
    <>
      <div className={styles.picture_title}>
        <p>照片縮圖：{(percent < 100) && percent+ '%'}</p>
        {isSetting && <Upload onClick={() => imgUpload_ref.current.click()}/>}
        <input type="file" onChange={handleChange} accept="/image/*" ref={imgUpload_ref} style={{display:'none'}}/>
      </div>
      
      <div className={styles.picture_list}>
          {input.picture_list.length > 0 ?
            input.picture_list.map((_data,idx)=>
              <div className={styles.picture} key={idx}>
                <img src={_data.url} alt={_data.name} />
                {isSetting && <Delete onClick={()=>handleDeletePic(_data.name)}/>}
              </div>
            )
            :
            <p>暫時無照片</p>
          }
          </div>
    </>
  )
}

const ToolModal = ({input,setInput,setModalOpen}) =>{
    const tool_ref = useRef(null)

    const handle_modal_close = () =>{
      setModalOpen(false)
    }

    const handle_tool_save = () =>{
      if (!tool_ref.current.value ) return;
      const temp = [...input.tools]
      temp.push(tool_ref.current.value)
      setInput({ ...input, tools: temp })
      handle_modal_close()
    } 
    
  return(
    <Modal>
      <div className={styles.modal}>
        <h2>增加工具</h2>
        <p>工具名稱:</p>
        <input type="text" ref={tool_ref} placeholder='請輸入工具名稱'/>
        <div className={styles.button_row}>
          <SmallBtn title='取消' func={handle_modal_close}/>
          <SmallBtn title='儲存' func={handle_tool_save}/>
        </div>
      </div>
    </Modal>
  )
}