var callbackID = null;

(function ($) {
    Drupal.behaviors.jQueryUpload = {
        attach: function (context, settings) {
            $('#fileupload').fileupload({
                url:'jQueryUploadURL',
                dataType: 'json',
                add: function (e,data) {
                    console.log('Added file');
                    data.submit();
                },
                start:function (e,data) {
                    $('#process_bar').css('width','0%');
                    $('#process_bar_text').html('0%');
                    $('#process_bar_tip').html('uploading...');
                    $('#progress').show();
                    console.log('Uploads started');
                },
                done: function (e, data) {
                    clearInterval(callbackID);
                    callbackID = null;
                    if(data.result.status=='success'){
                        $('#process_bar').css('width','100%');
                        $('#progress').hide();
                    }else{
                        $('#process_bar_tip').html(data.result.msg);
                    }

                    console.log('Uploads done');
                },
                progress:function (e, data) {
                    console.log(parseInt(data.loaded / data.total * 100, 10));
                        var process_number = parseInt(data.loaded / data.total * 50, 10);
                        if(process_number>=50){
                            if(typeof callbackID === 'undefined' || callbackID === null ){
                                callBackToGetBackgroundProcessNumber();
                            }
                        }else{
                            $('#process_bar').css('width',process_number + '%');
                            $('#process_bar_text').html(process_number + '%');
                        }
                },
            });
        }
    };

    function callBackToGetBackgroundProcessNumber(){
        callbackID = setInterval(getNumber,500);
    }

    function getNumber(){
        $.ajax({ 
            type:"POST", 
            url:"getProcessNumber", 
            success:function(data){
                if(typeof callbackID !== 'undefined' && callbackID !== null ){
                var process_number = 50 + parseInt(data.num) 
                $('#process_bar').css('width',process_number+ '%');
                $('#process_bar_text').html(process_number + '%');
                $('#process_bar_tip').html(data.msg);
                }
            }

        });
    }

})(jQuery);