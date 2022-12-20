import React, { useRef,useEffect, useState } from 'react'
import styles from "./index.module.scss"

import { useAuth } from "../../context/AuthContext"
import { storage } from "../../firebaseConfig";

import {ReactComponent as Upload} from '../../assets/upload_icon.svg';
import {ReactComponent as Delete} from '../../assets/delete_icon.svg';
import { Small_Btn,Row_Input,Textarea } from '../things';

//storage
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export default function HomePage() {
  const { fetch_User_Doc_Data , update_User_Doc_Data } = useAuth();
  const [data, setData] = useState()
  const [input, setInput] = useState({
    zh_name:'',
    zh_title:'',
    zh_introduction:'',
    en_name:'',
    en_title:'',
    en_introduction:'',
    contact: {github:'',linkedin:'',phone:'',email:''},
    picture_url: [],
  })
  const [loading, setLoading] = useState(true)
  const [isSetting, setIsSetting] = useState(false)
  const imgUpload_ref = useRef(null)
  
  // 刪除圖片
  const handleDeletePic = async(name) =>{
    const temp_url = [...input.picture_url]
    const newArray = temp_url.filter((pic)=> pic.name !== name)
    setInput({ ...input, picture_url: newArray })
    const picRef = ref(storage, `image/home/${name}`);
    await deleteObject(picRef).then(()=>{
      alert('刪除成功')
    }).catch((error) => {
      alert(error)
    });

  }
  //上傳圖片按鈕
  const handleUpload = () => {
    imgUpload_ref.current.click();
  };

  //上傳圖片過程
  const [percent, setPercent] = useState(0);
  function handleChange(event) {
    const file = event.target.files[0]
    const storageRef = ref(storage, `image/home/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",(snapshot) => {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setPercent(percent);
    },
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        const temp_url = [...input.picture_url]
        temp_url.push({name: file.name, url}) 
        setInput({ ...input, picture_url: temp_url })
      });
    });
  }

  //取消homepage編輯
  const handle_reset = () =>{
    setInput(data)
    setIsSetting(false)
  }
  
  //儲存homepage編輯
  const handle_save = () =>{
    update_User_Doc_Data('profile',input)
    setIsSetting(false)
  }
  
  useEffect(()=>{
    setLoading(true)
    fetch_User_Doc_Data('profile').then((data)=>{
      setData(data)
      setInput(data)
      setLoading(false)
    })
  },[])

  return (
    <div className={styles.home}>
        <h1>首頁</h1>
        {!loading &&
        <div className={styles.form}>
          <div className={styles.picture_title}>
            <p>目前照片：{(percent < 100) && percent+ '%'}</p>
            {isSetting && <Upload onClick={handleUpload}/>}
            <input type="file" onChange={handleChange} accept="/image/*" ref={imgUpload_ref} style={{display:'none'}}/>
          </div>
          
          <div className={styles.picture_list}>
          {input.picture_url.length > 0 ?
            input.picture_url.map((_data,idx)=>
              <div className={styles.picture} key={idx}>
                <img src={_data.url} alt={_data.name} />
                {isSetting && <Delete onClick={()=>handleDeletePic(_data.name)}/>}
              </div>
            )
            :
            <p>暫時無照片</p>
          }
          </div>
          
          <div className={styles.row}>
              <Row_Input title={'中文姓名'} setting={isSetting} value={input.zh_name} func={(e) => setInput({ ...input, zh_name: e.target.value })}/>
              <Row_Input title={'英文姓名'} setting={isSetting} value={input.en_name} func={(e) => setInput({ ...input, en_name: e.target.value })}/>
          </div>
          <div className={styles.row}>
            <Row_Input title={'中文職位'} setting={isSetting} value={input.zh_title} func={(e) => setInput({ ...input, zh_title: e.target.value })}/>
            <Row_Input title={'英文職位'} setting={isSetting} value={input.en_title} func={(e) => setInput({ ...input, en_title: e.target.value })}/>
          </div>
          <Textarea title={'中文簡介'} setting={isSetting} value={input.zh_introduction} func={(e) => setInput({ ...input, zh_introduction: e.target.value })}/>
          <Textarea title={'英文簡介'} setting={isSetting} value={input.en_introduction} func={(e) => setInput({ ...input, en_introduction: e.target.value })}/>
          
          <div className={styles.contact}>
            <p>聯絡方式</p>
            <div className={styles.row}>
              <Row_Input title={'phone'} setting={isSetting} value={input.contact.phone} func={(e) => setInput({ ...input, contact: {...input.contact,'phone': e.target.value}})}/>
              <Row_Input title={'email'} setting={isSetting} value={input.contact.email} func={(e) => setInput({ ...input, contact: {...input.contact,'email': e.target.value}})}/>
            </div>
            <div className={styles.row}>
              <Row_Input title={'github'} setting={isSetting} value={input.contact.github} func={(e) => setInput({ ...input, contact: {...input.contact,'github': e.target.value}})}/>
              <Row_Input title={'linkedin'} setting={isSetting} value={input.contact.linkedin} func={(e) => setInput({ ...input, contact: {...input.contact,'linkedin': e.target.value}})}/>
            </div>
          </div>

          <div className={styles.button_row}>
            {!isSetting ?
              <Small_Btn title='修改' func={()=>setIsSetting(true)}/>
            :
            <>
              <Small_Btn title='取消' func={handle_reset}/>
              <Small_Btn title='儲存' func={handle_save}/>
            </>
             }
          </div>
        </div>
        }
    </div>
  )
}
