import getPhotoUrl from 'get-photo-url'
import loader from '../assets/loader.svg'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { db } from '../dexie'
import React from 'react'

const Gallery =() =>{
    const allPhotos = useLiveQuery(()=> db.gallery.reverse().toArray( ), []);

    const [likes, setLikes]= useState(0);
    
    const [isClicked, setIsClicked]= useState(false);

    const [isOpen, setIsOpen]= useState(false);

    const openModal =() => {
        setIsOpen(true)
    }

    const closeModal =() =>{
        setIsOpen(false);
    }
    const handleClick = (id) => {
        db.gallery.add(id)
        if(isClicked){
            setLikes(likes - 1);
        }else{
            setLikes(likes + 1);
        }
        setIsClicked(!isClicked);
    };

    const addPhoto = async () => {
         db.gallery.add({
         url:await getPhotoUrl('#addPhotoInput'),
        })
    }

    const removePhoto =(id)=>{
        db.gallery.delete(id)
    }

    const clear =(id)=>{
        db.gallery.clear(id)
    }
    

    return (

       <>
            <input type="file" name='photo' id='addPhotoInput'/>
            
            <label htmlFor="addPhotoInput">
                <i className="add-photo-button fas fa-plus-square" onClick={addPhoto}></i>
            </label>
            
            <label htmlFor="clear">
                {isOpen &&(
                    <div className="modal">
                        <h2>Delete Message</h2>
                        <button 
                            onClick={closeModal} 
                            className="close-button"
                        >
                            &times;
                        </button>
                        <div className='main'>
                          <p>Are you sure you want to clear all Photos?</p>
                          <button
                              className='Yes'
                              onClick={() => {
                                clear();
                                closeModal();
                              }}
                            >
                                Yes, Delete it!
                            </button>  
                        </div>  
                    </div>
                )}
                <i className="clear-button fas fa-times" 
                    onClick={() => openModal()}
                >
                    Clear All Photos
                </i>
            </label>   
            
            <section className="gallery">
                {!allPhotos &&<p className="gallery-loader"> <img src={loader} alt=""/></p>}
                {!allPhotos?.length>0 && <div className='message'>No photo available</div>}
                { allPhotos?.map(photo =>(
                            <div className="item" key={photo.id}>
                                <img src={photo.url } className='item-image' alt=""/>
                                
                                <button className={`like-button ${isClicked && 'liked'}`}  onClick={() => {handleClick(photo.id)}}>
                                    <span className="likes-counter">{`Like | ${likes}`}</span>
                                </button>

                                {isOpen &&(
                                    <div className="modal">
                                        <h2>Delete Message</h2>
                                        <button 
                                            onClick={closeModal} 
                                            className="close-button"    
                                        >    
                                            &times;
                                        </button>
                                        <div className='main'>
                                            <p>Are you sure you want to clear all Photos?</p>
                                            <button
                                                className='Yes'
                                                onClick={() => {
                                                    removePhoto(photo.id);
                                                    closeModal();
                                                }}
                                            >
                                                Yes, Delete it!
                                            </button>  
                                        </div>  
                                    </div>
                                        
                                )}
                                <button className="delete-button" 
                                    onClick={ () => openModal()}
                                >
                                    Delete   
                                </button>
                          
                            </div>
                        )   
                    )
                }               
                

            </section>
            
        </>  
    )
}
export default Gallery