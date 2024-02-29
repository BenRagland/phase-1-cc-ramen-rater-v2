// index.js

//access DOM for Center Display Image and Text
const centerImage = document.querySelector('#ramen-detail img')
const centerDishName = document.querySelector("#ramen-detail h2")
const centerRestaurantName = document.querySelector("#ramen-detail h3")

const dishRating = document.querySelector("#rating-display")
const dishComment = document.querySelector("#comment-display")
let centerId = 0;

// Callbacks
const handleClick = (e,ramen) => {
  
  //set Center Image and text
  centerImage.src = e.target.src
  centerDishName.textContent = ramen.name
  centerRestaurantName.textContent = ramen.restaurant

  dishRating.textContent = ramen.rating
  dishComment.textContent = ramen.comment
  centerId = ramen.id
};

const addSubmitListener = () => {
  // Connect to DOM
  const submitButton = document.getElementById("submitButton")
  const submitForm = document.getElementById("new-ramen")
  
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault()

    console.log(e.target.image.value)

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
        alert("server response error --->",res)
      }
    })
    .then(ramen => {
      console.log("POST RESPONSE -->" , ramen)
    })
    .catch( e => {
      alert("server error ---->",e)
    })


  })

}

const displayRamens = () => {

  fetch('http://localhost:3000/ramens')
  .then(res => {
    if (res.ok){
      return res.json() 
    }else {
      alert("server response error --->",res)
    }
  })
  .then(ramens => {
    ramens.forEach((ramen) => {

      // Access DOM
      const ramenMenuDiv = document.getElementById("ramen-menu")
      
      // created stuff
      const ramenListUL = document.createElement("ul")
      const ramenListLI = document.createElement("li")
      const ramenImage = document.createElement("img")
      
      
      //add data to created stuff
      ramenImage.className = "ramen-img"
      ramenImage.src = ramen.image
      
      //append stuff
      ramenMenuDiv.appendChild(ramenListUL)
      ramenListLI.append(ramenImage)
      ramenListUL.append(ramenListLI)
      
      //when Clicking on ramen
      ramenListLI.addEventListener("click", (e) => handleClick(e , ramen))
      
      
    })
    
  })
  .catch( e => {
    alert("server error ---->",e)
  })
  
};


// Center Display 1st Obj in Dish List on Screen load
const displayCenterFirst = () => { 
  fetch('http://localhost:3000/ramens')
  .then(res => {
    if (res.ok)
      return res.json()
    else{
      alert("server response error ===>", res)
    }
  })
  .then(ramens => {
    if (centerDishName.textContent === "Insert Name Here"){
      
      centerImage.src = ramens[0].image
      centerDishName.textContent = ramens[0].name
      centerRestaurantName.textContent = ramens[0].restaurant
      
      dishRating.textContent = ramens[0].rating
      dishComment.textContent = ramens[0].comment
      
      centerId = ramens[0].id
      
      
    }
  })
}


// WARNING: Will Persist if uncommented. Check backupDB if needed.

const deleteDish = () =>{


    document.getElementById("delete-btn").addEventListener("click",()=>{

  //   fetch(`http://localhost:3000/ramens/${centerId}`,{
  //       method:"DELETE",
  //   })
  //   .then(res => res.json())
  //   .then(ramen => console.log(`ramen id:${ramen.id} deleted`))
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
//Create DeleteButton #delete-btn + #edit-btn created