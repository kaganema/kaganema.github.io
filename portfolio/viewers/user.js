function openPanel(e, category) {
	var i, tabcontent, tablinks;
	
	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName('tabcontent');
	for (i=0; i < tabcontent.length; i++){
		tabcontent[i].style.display = "none";
	}
	
	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName('tablink');
	for (i=0; i < tablinks.length; i++){
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	
	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(category).style.display = "block";
	e.currentTarget.className += ' active';
}

document.getElementById("defaultOpen").click();

var coll = document.getElementsByClassName('collapsed');

for(var i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight){
			content.style.maxHeight = null;
		}else{
			content.style.maxHeight = content.scrollHeight + "px";
		}
	});
}

/* function collapBtn() {
	var coll = document.getElementsByClassName('collapsed');
for(var i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight){
			content.style.maxHeight = null;
		}else{
			content.style.maxHeight = content.scrollHeight + "px";
		}
	});
}
} */