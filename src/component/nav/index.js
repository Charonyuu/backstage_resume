import React from 'react'
import styles from "./index.module.scss"
import { Link,useLocation } from 'react-router-dom'
import classnames from 'classnames'
import logo from '../../assets/charonyu-logo.png'

export default function Nav({children}) {
  const location = useLocation();
  return (
    <div className={styles.all}>
      <div className={styles.nav}>
        <div className={styles.picture}>
          <img src={logo} alt='logo'/>
        </div>
        <Link to='/' className={classnames(styles.navItem,{[styles.active]: location.pathname === '/'})}>Home</Link >
        <Link to='/about' className={classnames(styles.navItem,{[styles.active]: location.pathname === '/about'})}>About</Link >
        <Link to='/experience' className={classnames(styles.navItem,{[styles.active]: location.pathname === '/experience'})}>Experience</Link >
        <Link to='/portfilio' className={classnames(styles.navItem,{[styles.active]: location.pathname === '/portfilio'})}>Portfilio</Link >
        <Link to='/note' className={classnames(styles.navItem,{[styles.active]: location.pathname === '/note'})}>Note</Link >
        
      </div>
      <div className={styles.children}>
        {children}
      </div>
    </div>
    
  )
}
