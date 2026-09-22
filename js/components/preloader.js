window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    
    setTimeout(() => {
      preloader.classList.add("hide");

      setTimeout(() => {
        preloader.style.display = "none";
      }, 1000)

    }, 2000);

  });