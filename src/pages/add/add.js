const ipc=require('electron').ipcRenderer;
const util=require('../common/js/util');
$('#cancel').on('click',function(){
    ipc.send('add_close');
})
$('#save').on('click',save);
$('#edit').on('click',function(){
    save(null,$(this).data('id'));
});
function save(e,id){
    let params={
        name:$('#name').val(),
        sex:$('#sex').val(),
        age:$('#age').val(),
        degree:$('#degree').val(),
        mobile:$('#mobile').val(),
        address:$('#address').val(),
        intention:$('#intention').val(),
        remark:$('#remark').val()
    };
    if(!params.name){
        warn('请输入姓名');
    }else if(!params.sex){
        warn('请选择性别');
    }else if(!params.age){
        warn('请输入年龄');
    }else if(!params.degree){
        warn('请选择文凭');
    }else if(!params.mobile){
        warn('请输入联系方式');
    }else if(!params.address){
        warn('请输入地址');
    }else{
        if(id){
            params.id=id;
            util.editRecord(params,()=>{
                ipc.send('records_update');
                ipc.send('add_close');
            })
        }else{
            util.saveRecord(params,()=>{
                ipc.send('records_update');
                ipc.send('add_close');
            })
        }
    }
}
function warn(msg){
    $('#errorMsg').text(msg||'请检查输入');
    $('#alertModal').modal();
}
ipc.on('initEdit',(e,data)=>{
    $('#save').hide();
    $('#edit').data('id',data.id).show();
    $('#name').val(data.name);
    $('#sex').val(data.sex);
    $('#age').val(data.age);
    $('#degree').val(data.degree);
    $('#mobile').val(data.mobile);
    $('#address').val(data.address);
    $('#intention').val(data.intention);
    $('#remark').val(data.remark);
})