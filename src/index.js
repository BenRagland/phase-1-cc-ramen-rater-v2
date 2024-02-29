// index.js

//access DOM for Center Display Image and Text
const centerImage = document.querySelector('#ramen-detail img')
const centerDishName = document.querySelector("#ramen-detail h2")
const centerRestaurantName = document.querySelector("#ramen-detail h3")

const dishRating = document.querySelector("#rating-display")
const dishComment = document.querySelector("#comment-display")
//Div holds all ramens on screen
const allRamensDisplayList = document.querySelector("#ramen-menu")

//connect to Form
const submitForm = document.getElementById("new-ramen")

let editMode = false



// Callbacks
const handleClick = (e,ramen) => {

  //set Center Image and text
  centerImage.src = e.target.src
  centerDishName.textContent = ramen.name
  centerRestaurantName.textContent = ramen.restaurant

  dishRating.textContent = ramen.rating
  dishComment.textContent = ramen.comment
  centerImage.setAttribute("alt", `${ramen.id}`) 

  //clear edit form on click of new dish
  editMode = false
  console.log("edit Mode on ramen menu click --->", editMode)
  submitForm.name.placeholder = ""
  submitForm.restaurant.placeholder = ""
  submitForm["new-image"].placeholder = ""
  submitForm.rating.placeholder = " "
  submitForm["new-comment"].placeholder = " "
};

const addSubmitListener = () => {
  if (!submitForm){
    return  
  }
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const newDish = {
      name: e.target.name.value ,
      restaurant: e.target.restaurant.value ,
      image: e.target.image.value ,
      rating: e.target.rating.value ,
      comment: e.target["new-comment"].value ,

    }

    fetch('http://localhost:3000/ramens',{
      method:"POST",
      headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
      body: JSON.stringify(newDish)
    })
    .then(res => {
      if (res.ok){
        return res.json() 
      }else {
        alert(`server response error, submitListener ---> ${res}`)
      }
    })
    .then(ramen => {
      console.log("POST RESPONSE -->" , ramen)
    })
    .catch( e => {
      alert(`server error ----> submitListener , ${e}`)
    })


  })
//Need to find centerImageID
  console.log("center Image Id -->", centerImage)
  if (editMode === true){
    console.log("edit mode true" , editMode)
    //need to get correct ID
    fetch(`http://localhost:3000/ramens/${centerImage.id}`, {
      method:"PATCH",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        name: submitForm.name.value,
        restaurant: submitForm.restaurant.value,
        image:submitForm["new-image"].src,
        rating: submitForm.rating.value,
        comment:submitForm["new-comment"].value
      })

  })
  }

}

const displayRamens = () => {

  fetch('http://localhost:3000/ramens')
  .then(res => {
    if (res.ok){
      return res.json() 
    }else {
      alert(`server error ----> display , ${e}`)
    }
  })
  .then(ramens => {
    // Access DOM
    const ramenMenuDiv = document.getElementById("ramen-menu")
   
    ramens.forEach((ramen) => {
        
      // created stuff
      const ramenImage = document.createElement("img")
      
      //add data to created stuff
      ramenImage.className = "ramen-img"
      ramenImage.src = ramen.image
      ramenImage.id = ramen.id
      ramenImage.dishName = ramen.name
      ramenImage.restaurant = ramen.restaurant
      ramenImage.rating = ramen.rating
      ramenImage.comment = ramen.comment
      
      //append stuff
        ramenMenuDiv.appendChild(ramenImage)

      //when Clicking on a ramen img
      ramenImage.addEventListener("click", (e) => handleClick(e , ramen))
    })
    
  })
  .catch( e => {
    console.log(e)
    alert(`server error ----> displayramens , ${e}` )
  })
  
};


// Center Display 1st Obj in Dish List on Screen load
const displayCenterFirst = () => { 
  fetch('http://localhost:3000/ramens')
  .then(res => {
    if (res.ok)
      return res.json()
    else{
      alert(`server response error, displayCenterFirst ===> ${res}`)
    }
  })
  .then(ramens => {
    if (centerDishName.textContent === "Insert Name Here"){
      
      if(centerDishName){
        centerImage.src = ramens[0].image
        centerDishName.textContent = ramens[0].name
        centerRestaurantName.textContent = ramens[0].restaurant
        
        dishRating.textContent = ramens[0].rating
        dishComment.textContent = ramens[0].comment

      }
    
    }
  })
}


// WARNING: Will Persist if uncommented. Check backupDB if needed.
const deleteDish = () =>{

    document.getElementById("delete-btn").addEventListener("click",(e)=>{    
  
      for ( let img of allRamensDisplayList.children){
        if (img.id === centerImage.id){
          img.remove()
          //delete center image and details
          alert(`${centerDishName.textContent} Removed`)
          centerImage.src =  "./assets/image-placeholder.jpg"
          centerDishName.textContent = ""
          centerRestaurantName.textContent = ""
          dishRating.textContent =""
          dishComment.textContent=""

          // fetch(`http://localhost:3000/ramens/${img.id}`,{
          //     method:"DELETE",
          // })
          // .then(res => res.json())
          // .then(ramen => console.log(`ramen id:${ramen.id} deleted`))
        }
      }
   
    })
  
}


function editRamen(){
  const editBtn = document.getElementById("edit-btn").addEventListener("click",() =>{
    if (editMode === true){
      editMode = false

    //clear edit form on re-click of edit button
    console.log("edit Mode on ramen menu click --->", editMode)
    submitForm.name.placeholder = ""
    submitForm.restaurant.placeholder = ""
    submitForm["new-image"].placeholder = ""
    submitForm.rating.placeholder = " "
    submitForm["new-comment"].placeholder = " "
    
  }else{
      editMode = true
    }
    console.log("Edit Mode --->", editMode)
    if (editMode === true){
      submitForm.name.placeholder = centerDishName.textContent
      submitForm.restaurant.placeholder = centerRestaurantName.textContent
      submitForm["new-image"].placeholder = `.${centerImage.src.slice(21)}`
      submitForm.rating.placeholder = dishRating.textContent
      submitForm["new-comment"].placeholder = dishComment.textContent 
    }


  })

}

const main = () => {
  // Invoke displayRamens here
  // Invoke addSubmitListener here
  
  displayRamens()
  addSubmitListener()
  
  // Center Display 1st Obj in Dish List on Screen load
  displayCenterFirst()
  deleteDish()
  editRamen()
}
main()


// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};


//Create EditMode Boolean
//Create DeleteButton #delete-btn + #edit-btn created-->> use global variables
//centerimage ,center dishname 