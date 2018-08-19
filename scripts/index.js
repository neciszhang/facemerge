$(function () {

    var $resultNode = $('#resultNode');
    var $resultNodeUpload = $('#resultNodeUpload');
    var canvas1, canvas3;

    var vm = new Vue({
        el: '#app',
        data: {
            faces: null
        }
    });

    var vm2 = new Vue({
        el: '#app2',
        data: {
            faces:null,
            merge_rate: 50,
            selected:0
        }
    });

    var vm3 = new Vue({
        el: '#app3',
        data: {
            src: null
        }
    });

    document.getElementById('file-input').onchange = function (e) {
        if ($resultNode) {
            $resultNode.empty();
        }
        loadImage(
            e.target.files[0],
            function (img) {
                canvas1 = img;
                $resultNode.append(img);
            },
            { maxWidth: 600, canvas: true } // Options
        );
    };

    document.getElementById('file-input-upload').onchange = function (e) {
        if ($resultNodeUpload) {
            $resultNodeUpload.empty();
        }
        loadImage(
            e.target.files[0],
            function (img) {
                canvas3 = img;
                $resultNodeUpload.append(img);
            },
            { maxWidth: 600, canvas: true } // Options
        );
    };

    $("#upload").on("click", function () {
        if (!canvas1) {
            return false;
        }

        let img = canvas1.toDataURL('image/jpeg')

        $.ajax({
            url: "https://shell.farvis.cn/api/face/detect",
            type: 'post',
            dataType: 'JSON',
            data: {
                'img': img
            },
            success: function (respond) {
                vm.faces = respond.faces;
                vm2.faces = respond.faces;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('网路错误，请稍后再试！');
            }
        });

    });


    $("#upload-all").on("click", function () {
        if (!canvas1) {
            alert("请上传模板图");
            return false;
        }
        if (!canvas3) {
            alert("请上传替换图");
            return false;
        }

        let template_base64 = canvas1.toDataURL('image/jpeg');
        let template_rectangle= vm2.faces[vm2.selected].face_rectangle.top+","+vm2.faces[vm2.selected].face_rectangle.left+","+vm2.faces[vm2.selected].face_rectangle.width+","+vm2.faces[vm2.selected].face_rectangle.height;
        let merge_base64 = canvas3.toDataURL('image/jpeg');
        let merge_rate=vm2.merge_rate;

        $.ajax({
            url: "https://shell.farvis.cn/api/face/mergeface",
            type: 'post',
            dataType: 'JSON',
            data: {
                'template_base64': template_base64,
                'template_rectangle': template_rectangle,
                'merge_base64': merge_base64,
                'merge_rate': merge_rate,
            },
            success: function (respond) {
                vm3.src="data:image/jpeg;base64,"+respond.result;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('网路错误，请稍后再试！');
            }
        });

    });

});