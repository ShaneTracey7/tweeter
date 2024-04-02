

//var img1 = document.getElementById("shortProfile-img");

var modal = document.getElementsByClassName("profileModal");
var test = document.getElementById("tnb");



//img1.addEventListener("mouseenter", handleMouseEnter);
//img1.addEventListener("mouseout", handleMouseOut);


for (let i = 1; i < 4; i++) { 

    let str_id1= "spi-" + i;
    let str_id2= "pm-" + i;
    var img1 = document.getElementById(str_id1);
    img1.addEventListener("mouseenter", function(){ let m = document.getElementById(str_id2); m.style.display = "flex"; let x = m.offsetLeft;
let y = this.offsetTop;});
    img1.addEventListener("mouseout", function(){ document.getElementById(str_id2).style.display = "none";});
    // gonna use offset left and offset top to get coordinates of profile img and postion the modal to the center of the center of those coordinates
  }
