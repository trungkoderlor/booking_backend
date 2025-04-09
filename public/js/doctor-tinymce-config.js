document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".tinymce-editor")) {
    tinymce.init({
      selector: "textarea.tinymce-editor",
      height: 300,
      plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
      ],
      toolbar:
        "undo redo | formatselect | " +
        "bold italic backcolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      setup: function (editor) {
        editor.on("change", function () {
          editor.save();
        });
      },
    });
  }
});
