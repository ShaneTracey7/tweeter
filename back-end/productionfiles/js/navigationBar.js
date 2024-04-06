
function notificationClick() {
    if(document.getElementById("navbarN").src == '/static/images/bell-fill.svg')
    {
        document.getElementById("navbarN").src = '/static/images/bell.svg';
    }
    else
    {
        document.getElementById("navbarN").src = '/static/images/bell-fill.svg';
    }
  }