import './style/index.css'
function pack(){
  let main = 2
  (()=>{
    alert(main)
  })()
}
pack()
let word = document.createElement('p')
word.innerHTML = "Hello Webpack"
document.body.appendChild(word)