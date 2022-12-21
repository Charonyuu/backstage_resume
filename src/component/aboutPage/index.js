import React, { useEffect, useState } from 'react'
import styles from "./index.module.scss"
import { useAuth } from "../../context/AuthContext"
import { SmallBtn,Modal} from '../things'
import { AiOutlineEdit,AiFillDelete,AiOutlineRight,AiOutlinePlus } from "react-icons/ai";

export default function AboutPage() {
  const {fetch_User_Doc_Data,update_User_Doc_Data} = useAuth()
  const [data,setData] = useState()
  const [loading,setLoading] = useState(true)
  const [modalOpen,setModalOpen] = useState({open:false,title:'',data:null})

  const [input,setInput] =useState({
    zh_skill:[],
    zh_target:[],
    en_skill:[],
    en_target:[],
  })
  const [isSetting,setIsSetting] = useState(false)

  const handle_reset = () =>{
    setInput(data)
    setIsSetting(false)
  }

  const handle_save = ()=>{
    setIsSetting(false)
    update_User_Doc_Data('about',input)
  }

  const handle_close_modal = () =>{
    setModalOpen({open:false,data:null,title:''})
  }
  
  const handle_delete_skill = (type,id) =>{
    const temp = [...input[type]]
    const result = temp.filter((item) => item.id !== id)
    setInput({...input,[type]:result});
  }
  

  useEffect(()=>{
    setLoading(true)
    fetch_User_Doc_Data('about').then((data)=>{
      setData(data)
      setInput(data)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return  (
    <div className={styles.home}>
        <h1>工作經歷修改</h1>
        {!loading &&
        <div className={styles.form}>

          <div className={styles.skill_title}>
            <h3>中文Skill</h3>
             {isSetting ?
            <AiOutlinePlus onClick={()=>setModalOpen({open:true,title:'zh_skill',data:null})}/>
            :null }
          </div>
          <div className={styles.skill_list}>
            {input.zh_skill.length > 0 && input.zh_skill.map((skill,idx) =>
              <div className={styles.skill_container} key={idx}>
                <span className={styles.skill_name}>{skill.title} </span>
                {isSetting &&
                  <div className={styles.icons_list}>
                    <AiOutlineEdit className={styles.edit} onClick={()=>setModalOpen({open:true,title:'zh_skill',data:skill})}/>
                    <AiFillDelete className={styles.delete} onClick={()=>handle_delete_skill(skill.title)}/>
                  </div>   
                }
              </div>
            )}
          </div>
          <div className={styles.skill_title}>
            <h3>英文Skill</h3>
             {isSetting ?
            <AiOutlinePlus onClick={()=>setModalOpen({open:true,title:'en_skill',data:null})}/>
            :null }
          </div>
          <div className={styles.skill_list}>
            {input.en_skill.length > 0 && input.en_skill.map((skill,idx) =>
              <div className={styles.skill_container} key={idx}>
                <p ><span className={styles.skill_name}>{skill.title} </span></p>
                {isSetting &&
                  <div className={styles.icons_list}>
                    <AiOutlineEdit className={styles.edit} onClick={()=>setModalOpen({open:true,title:'en_skill',data:skill})}/>
                    <AiFillDelete className={styles.delete} onClick={()=>handle_delete_skill('en_skill',skill.id)}/>
                  </div>   
                }
              </div>
            )}
          </div>
          <div className={styles.target_title}>
            <p>中文Target</p>
            {isSetting ?
            <AiOutlineRight onClick={()=>setModalOpen({...modalOpen,open:true,title:'zh_target',data:input.zh_target})}/> 
            : null}
          </div>
          <div className={styles.target_title}>
            <p>英文Target</p>
            {isSetting ?
            <AiOutlineRight onClick={()=>setModalOpen({...modalOpen,open:true,title:'en_target',data:input.en_target})}/>
            : null}
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

          {modalOpen.open && (modalOpen.title.includes('target') ?
            <TargetModal 
              input={input} 
              setInput={setInput} 
              modalOpen={modalOpen} 
              closeModal={handle_close_modal}
            />
            :
            <SkillModal input={input} setInput={setInput} modalOpen={modalOpen} setModalOpen={setModalOpen}
             closeModal={handle_close_modal}
            />)
          }

        </div>
          }

    </div>
  )
}

const TargetModal = (props) =>{
  const { input, setInput, modalOpen,closeModal} = props
  const [contentInput,setContentInput] = useState('')
  const [modalList,setModalList] = useState([]) 
  const target = modalOpen.title //中文目標還是英文目標
  useEffect(()=>{
    const list = modalOpen.data || []
    setModalList(list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handle_modal_add_item = () =>{
    const temp = [...modalList]
    temp.push({id: new Date().getTime().toString(),content: contentInput})
    setContentInput('')
    setModalList(temp)
  }
  const handle_modal_save = () =>{
      setInput({...input,[target]:modalList})
      closeModal()
  }
  const handle_modal_item_delete = (id) =>{
    const temp = [...modalList]
    const result = temp.filter((item)=> item.id !== id)
    setModalList(result)
  }

  return(
  <Modal>
    <div className={styles.modal}>
      <p>{modalOpen.title}</p>
        <div className={styles.modal_row}>
          <input value={contentInput} onChange={(e)=>setContentInput(e.target.value)}/>
          <SmallBtn title='+' func={handle_modal_add_item}/>
        </div>
        <div className={styles.item_list}>
          
          {modalList.map((item,idx)=>
            <div className={styles.item} key={idx}>
              <p>{item.content}</p>
              <AiFillDelete className={styles.delete} onClick={()=>handle_modal_item_delete(item.id)}/>
            </div>
          )}
        </div>
        <div className={styles.button_row}>
          <SmallBtn title='取消' func={closeModal}/>
          <SmallBtn title='完成' func={handle_modal_save}/>
        </div>
    </div>
  </Modal>
)}

const SkillModal = (props) =>{
  const { input, setInput, modalOpen,closeModal} = props
  const [titleInput,setTitleInput] = useState({sort:0,title:''})
  const [contentInput,setContentInput] = useState('')
  const [list,setList] = useState([])
  const skill = modalOpen.title
  useEffect(()=>{
    if (modalOpen.data) {
      setTitleInput({sort:modalOpen.data.sort,title:modalOpen.data.title})
      setList(modalOpen.data.content)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handle_modal_add_item = () =>{
    const temp = [...list]
    temp.push({id: new Date().getTime().toString(),content: contentInput})
    setContentInput('')
    setList(temp)
  }

  const handle_modal_save = () =>{
    const temp = [...input[skill]]
    if (modalOpen.data) {
      const place = temp.findIndex((item)=> item.id === modalOpen.data.id)
      temp[place] = {id:modalOpen.data.id,sort: titleInput.sort,title:titleInput.title,content:list}
     }else{
      temp.push({id:new Date().getTime().toString(),sort: titleInput.sort,title:titleInput.title,content:list})
     }
    setInput({...input,[skill]:temp})
    closeModal();
  }
  
  const handle_modal_item_delete = (id) =>{
    const temp = [...list]

    const result = temp.filter((item)=> item.id !== id)
    setList(result)
  }
  return(
  <Modal>
    <div className={styles.modal}>
      <p>{modalOpen.title}</p>
        <div className={styles.modal_row}>
          <div className={styles.row_item}>
            <p>順序:</p>
            <input value={titleInput.sort} onChange={(e) => setTitleInput({ ...titleInput, sort: e.target.value })}/>
          </div>
          <div className={styles.row_item}>
            <p>標題:</p>
            <input value={titleInput.title} onChange={(e) => setTitleInput({ ...titleInput, title: e.target.value })}/>
          </div>
        </div>
        <div className={styles.modal_row}>
          <input value={contentInput} onChange={(e)=>setContentInput(e.target.value)}/>
          <SmallBtn title='+' func={handle_modal_add_item}/>
        </div>
        <div className={styles.item_list}>
          
          {list.map((item,idx)=>
            <div className={styles.item}>
              <p>{item.content}</p>
              <AiFillDelete className={styles.delete} onClick={()=>handle_modal_item_delete(item.id)}/>
            </div>
          )}
        </div>
        <div className={styles.button_row}>
          <SmallBtn title='取消' func={closeModal}/>
          <SmallBtn title='完成' func={handle_modal_save}/>
        </div>
    </div>
  </Modal>
)}