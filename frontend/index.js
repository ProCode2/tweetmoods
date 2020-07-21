const btn = document.querySelector('.btn');
const input = document.querySelector('.input');
const name = document.querySelector('.username');
const bio = document.querySelector('.bio');
const main = document.querySelector('#score-show');
const emoji = document.querySelector('.sentiment');

const scores = new Map([
  [-5 , './emoticons/n5.svg'],
  [-4 , './emoticons/n4.svg'],
  [-3 , './emoticons/n3.svg'],
  [-2 , './emoticons/n2.svg'],
  [-1 , './emoticons/n1.svg'],
  [0 , './emoticons/neutral.svg'],
  [1 , './emoticons/p1.svg'],
  [2 , './emoticons/p2.svg'],
  [3 , './emoticons/p3.svg'],
  [4 , './emoticons/p4.svg'],
  [5 , './emoticons/p5.svg'],
]);

const getData = (username) => {
  fetch('./' + username)
  .then(res => res.json())
  .then(data => {
    //setting main section to visible mode
    main.style.display = 'block';
    //Changing the background
    main.style.background = '#' + data.bg_color;
    //changing text colour 
    main.style.color = '#' + data.text_color;
    //setting username
    name.textContent = data.username;
    //setting bio
    bio.textContent = data.bio;
    //swetting the emoji
    if(data.score > 0){
      emoji.src = './' + scores.get(Math.ceil(data.score));

    }else{
      emoji.src = './' + scores.get(Math.floor(data.score));
    }
    
  })
  .catch(err => console.log(err));
}

btn.addEventListener('click', () => {
  if(input.value){
    getData(input.value);
    input.value = '';
  }
});
