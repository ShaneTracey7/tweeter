
for (let i = 1; i < 4; i++) { 

    let str_id1= "spi-" + i;
    let str_id2= "pm-" + i;
    var img1 = document.getElementById(str_id1);
    var m1 = document.getElementById(str_id2); 
    var timer;

    img1.addEventListener("mouseenter", function(){ 
        timer = setTimeout(function(){
        let m = document.getElementById(str_id2);
        let img2 = document.getElementById(str_id1);
        m.style.display = "flex";
        m.style.position = "fixed";
        let img_width = 40;
        let img_height = 40;
        let modal_width = 300;
        let x = img2.offsetLeft;
        let y = img2.offsetTop;
        
        m.style.left = x + (img_width/2) - (modal_width/2) - window.scrollX + "px";
        m.style.top = y + img_height + 10 - window.scrollY + "px";
        }, 1000);
        });
    img1.addEventListener("mouseout", function(){ /*document.getElementById(str_id2).style.display = "none"; */clearTimeout(timer); });
    
    /*
    m1.addEventListener("mouseenter", function(){ 
        let m = document.getElementById(str_id2); 
        m.style.display = "flex";
        m.style.position = "fixed";
        let img_width = 40;
        let img_height = 40;
        let modal_width = 300;
        let x = img1.offsetLeft;
        let y = img1.offsetTop;
        m.style.left = x + (img_width/2) - (modal_width/2) + "px";
        m.style.top = y + img_height + 10 + "px";
        
});*/
    m1.addEventListener("mouseleave", function(){ document.getElementById(str_id2).style.display = "none";});

    document.getElementById("sc").addEventListener("scroll", function(){ document.getElementById(str_id2).style.display = "none";});
    // gonna use offset left and offset top to get coordinates of profile img and postion the modal to the center of the center of those coordinates
}
