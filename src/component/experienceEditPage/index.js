import React, { useEffect, useRef, useState } from 'react'
import styles from "./index.module.scss"
import { useAuth } from "../../context/AuthContext"
import { RowInput,SmallBtn ,Textarea ,Modal} from '../things'
import { useLocation } from 'react-router-dom'
import { AiOutlineRight,AiFillDelete } from "react-icons/ai";

export default function ExperienceEditPage() {
  const {update_User_Collection_Data} = useAuth()
  const [data,setData] = useState()
  const [modalOpen,setModalOpen] = useState({open: false, id: '',data:null})
  const [input,setInput] =useState({
      startDate:'',endDate:'',
      zh_company_name:'',en_company_name:'',
      zh_title:'',en_title:'',
      zh_introduction:'',en_introduction:'',
      tools:[],
      exhibit: []
    })

  const [isSetting,setIsSetting] = useState(false)

  const handle_reset = () =>{
    setInput(data)
    setIsSetting(false)
  }

  const handle_save = ()=>{
    update_User_Collection_Data('experience','experience_list',input.zh_company_name,input)
    setIsSetting(false)
  }

  const handle_modal_close = () =>{
    setModalOpen({open:false,id:''})
  }


  const handle_delete_tool = (tool_name) =>{
    const yes = window.confirm('你確定嗎？');
    if (!yes) return;
    const temp = [...input.tools]
    const result = temp.filter((tool)=> tool !== tool_name)
    setInput({ ...input, tools: result })
  }

  const handle_delete_exhibit = (exhibit_name) =>{
    const yes = window.confirm('你確定嗎？');
    if (!yes) return;
    const temp = [...input.exhibit]
    const result = temp.filter((exhibit)=> exhibit.name !== exhibit_name)
    setInput({ ...input, exhibit: result })
  }


  const location = useLocation()
  useEffect(()=>{
    const state_data = location.state || {
      startDate:'',endDate:'',
      zh_company_name:'',en_company_name:'',
      zh_title:'',en_title:'',
      zh_introduction:'',en_introduction:'',
      tools:[],
      exhibit: []
    }
    setData(state_data)
    setInput(state_data)
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  return  (
    <div className={styles.home}>
        <h1>工作經歷修改</h1>
        <div className={styles.form}>
          <div className={styles.row}>
              <RowInput title={'開始工作日期'} setting={isSetting} value={input.startDate} func={(e) => setInput({ ...input, startDate: e.target.value })} placeholder={"西元年/月"}/>
              <RowInput title={'結束工作日期'} setting={isSetting} value={input.endDate} func={(e) => setInput({ ...input, endDate: e.target.value })}  placeholder={"西元年/月"}/>
          </div>
          <div className={styles.row}>
              <RowInput title={'中文公司名稱'} setting={isSetting} value={input.zh_company_name} func={(e) => setInput({ ...input, zh_company_name: e.target.value })} placeholder={"輸入名稱"}/>
              <RowInput title={'英文公司名稱'} setting={isSetting} value={input.en_company_name} func={(e) => setInput({ ...input, en_company_name: e.target.value })} placeholder={"輸入名稱"}/>
          </div>
          <div className={styles.row}>
            <RowInput title={'中文公司職位'} setting={isSetting} value={input.zh_title} func={(e) => setInput({ ...input, zh_title: e.target.value })} placeholder={"輸入職位"}/>
            <RowInput title={'英文公司職位'} setting={isSetting} value={input.en_title} func={(e) => setInput({ ...input, en_title: e.target.value })} placeholder={"輸入職位"}/>
          </div>
          <Textarea title={'中文公司簡介'} setting={isSetting} value={input.zh_introduction} func={(e) => setInput({ ...input, zh_introduction: e.target.value })} placeholder={"輸入內容..."}/>
          <Textarea title={'英文公司簡介'} setting={isSetting} value={input.en_introduction} func={(e) => setInput({ ...input, en_introduction: e.target.value })} placeholder={"輸入內容..."}/>
          <div className={styles.tool_title}>
            使用工具
            {isSetting && <AiOutlineRight onClick={()=>setModalOpen({open:true,id:'tool',data:null})}/>}
          </div>
          <div className={styles.tool_list}>
            {input.tools.map((tool,idx) =>
              <div className={styles.tool} key={idx}>
                {tool}
                {isSetting &&<AiFillDelete onClick={()=>handle_delete_tool(tool)}/>}
              </div>
            )}
          </div>

          <div className={styles.tool_title}>
            公司內專案
             {isSetting && <AiOutlineRight onClick={()=>setModalOpen({open:true,id:'exhibit',data:null})}/>}
          </div>
          <div className={styles.exhibit_list}>
            {input.exhibit.length > 0 && input.exhibit.map((exhibit_item,idx) =>
              <div className={styles.exhibit} key={idx}>
                <p ><span className={styles.exhibit_name}>{exhibit_item.name} </span>{exhibit_item.url}</p>
                <p className={styles.exhibit_url}></p>
                <p>{exhibit_item.content}</p>
                {isSetting &&<AiFillDelete onClick={()=>handle_delete_exhibit(exhibit_item.name)}/>}
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


             {/* modal */}
          {modalOpen.open && <ExperienceModal id={modalOpen.id} input={input} setInput={setInput} closeModal={handle_modal_close}/> }
        </div>
    </div>
  )
}

const ExperienceModal = ({id,input,setInput,closeModal}) =>{
  const tool_ref = useRef(null)
  const exhibit_web_name_ref = useRef(null)
  const exhibit_web_url_ref = useRef(null)
  const exhibit_web_zh_content_ref = useRef(null)
  const exhibit_web_en_content_ref = useRef(null)

  const handle_exhibit_save = () =>{
    if (!exhibit_web_name_ref.current.value ) return;
    const temp = [...input.exhibit]
    temp.push(
      {
        name:exhibit_web_name_ref.current.value,
        url:exhibit_web_url_ref.current.value,
        zh_content:exhibit_web_zh_content_ref.current.value,
        en_content:exhibit_web_en_content_ref.current.value
      })
    setInput({ ...input, exhibit: temp})
    alert('儲存成功')
    closeModal()
  }

  const handle_tool_save = () =>{
    if (!tool_ref.current.value ) return;
    const temp = [...input.tools]
    temp.push(tool_ref.current.value)
    setInput({ ...input, tools: temp })
    alert('儲存成功')
    closeModal()
  } 
  return(
    <Modal>
      <div className={styles.modal}>
      {id === 'tool' ?
        <>
          <h2>增加工具</h2>
          <p>工具名稱:</p>
          <input type="text" ref={tool_ref} placeholder='請輸入工具名稱'/>
        </>
        :
        <>
          <h2>增加展示頁面</h2>
          <p>網頁名稱:</p>
          <input type="text" ref={exhibit_web_name_ref} placeholder='請輸入網頁名稱'/>
          <p>網頁網址:</p>
          <input type="text" ref={exhibit_web_url_ref} placeholder='請輸入網頁網址'/>
          <p>網頁中文大綱:</p>
          <textarea ref={exhibit_web_zh_content_ref} placeholder='請輸入網頁內容'/>
          <p>網頁英文大綱:</p>
          <textarea ref={exhibit_web_en_content_ref} placeholder='請輸入網頁內容'/>
        </>
      } 
      <div className={styles.button_row}>
        <SmallBtn title='取消' func={closeModal}/>
        <SmallBtn title='儲存' func={id === 'tool' ? handle_tool_save : handle_exhibit_save}/>
      </div>
      </div>
    </Modal>
  )
}