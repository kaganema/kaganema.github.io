function toggles(action) {
    var section = document.querySelector('.topics, .skillset');
    var len = section.length;
    for(var i=0; i<len; i++){
        var ref = section[i];
        switch(action) {
            case "collapse":
                ref.style.display = "none";
                break;
            case "expand":
                ref.style.display = "block";
                break;
        }
    }
}