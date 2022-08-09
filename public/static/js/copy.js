function copy_citation(text_id) {
/* Get the text field */
var copyText = document.getElementById(text_id);

/* Select the text field */
copyText.select();
copyText.setSelectionRange(0, 99999); /* For mobile devices */
/* Copy the text inside the text field */
document.execCommand("copy");
/* Alert the copied text */
alert("Copied citation: " + copyText.value);
}
