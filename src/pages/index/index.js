const ipc=require('electron').ipcRenderer;
const util=require('../common/js/util');
const sexMap={'1':'男','2':'女'};
const ageMap={'1':'^1[8-9]|2[0-5]$','2':'^2[6-9]|30$','3':'^3[1-5]$','4':'^3[6-9]|40$','5':'^4[1-9]|50$','6':'^[5-9][1-9]|1[0-9]{2}$'};
const degreeMap={'1':'小学','2':'初中','3':'高中','4':'中专','5':'大专','6':'大学','7':'研究生及以上'};

let $table=null;
initTable();

function initTable(){
    let data=util.readRecord();
    if($table){
        $table.destroy();
    }
    $table=$('.table').DataTable( {
        "data": data,
        "columns": [
            { "data": "name" },
            { "data": "sex" ,render:function(data,type,row){
                    if(type==='display') {
                        return sexMap[data];
                    }
                    return data;
                }},
            { "data": "age"},
            { "data": "degree",render:function(data,type,row){
                    if(type==='display') {
                        return degreeMap[data];
                    }
                    return data;
                }},
            { "data": "mobile" },
            { "data": "address" },
            { "data": "intention" },
            { "data": "remark" },
            {"data" : null}
        ],
        aoColumnDefs:[
            {
                targets:8,
                render:function(data,type,row){
                    let html = '';
                    html += '<span class="editTableBtn table-btn">编辑</span>';
                    html += '<span  class="delTableBtn table-btn">删除</span>'
                    return html;
                }
            }
        ],
        paging: true,
        ordering:false,
        // searching:false,
        language:{
            "emptyTable":  "没有数据",
            "info":        "当前 _START_ 到 _END_ 条记录，共 _TOTAL_ 条记录",
            "infoEmpty":   "当前 0 到 0 条记录，共 0 条记录",
            "infoFiltered": "(从 _MAX_ 条记录中查询的结果)",
            "lengthMenu":     "每页 _MENU_ 条记录",
            "loadingRecords": "加载中...",
            "processing":     "处理中...",
            "search": "搜索",//用来描述搜索输入框的字符串
            "zeroRecords": "没有找到",//当没有搜索到结果时，显示
            "paginate": {
                "first":      "首页",
                "last":       "最后一页",
                "next":       "下一页",
                "previous":   "上一页"
            }
        }
    } );
}

$('#searchBtn').on('click',function(){
    let name=$('#name').val(),
        sex=$('#sex').val(),
        age=$('#age').val(),
        degree=$('#degree').val(),
        mobile=$('#mobile').val();
    let tableData=$table;
    if(name){
        tableData.column(0).search(name);
    }else{
        tableData.column(0).search('');
    }
    if(sex){
        tableData.column(1).search(sex);
    }else{
        tableData.column(1).search('');
    }
    if(age){
        console.log(ageMap[age],age)
        tableData.column(2).search(ageMap[age],true,false);
    }else{
        tableData.column(2).search('');
    }
    if(degree){
        tableData.column(3).search(degree);
    }else{
        tableData.column(3).search('');
    }
    if(mobile){
        tableData.column(4).search(mobile);
    }else{
        tableData.column(4).search('');
    }
    tableData&&tableData.draw();
});
$('#resetBtn').on('click',function(){
    $('#name').val('');
    $('#sex').val('');
    $('#age').val('');
    $('#degree').val('');
    $('#mobile').val('');
})
$(document).on( 'click', '.editTableBtn', function () {
    let data = $table.row($(this).parents('tr')).data();
    ipc.send('edit',data);
} );
$(document).on( 'click', '.delTableBtn', function () {
    let data = $table.row($(this).parents('tr')).data();
    warn('确定要删除吗',data.id);
} );
$('#confirmDel').on('click',function(){
    let id=$(this).data('id');
    $('#alertModal').modal('hide');
    util.deleteRecord(id,()=>{
        initTable();
    })
})
$('#createBtn').on('click',function(){
    ipc.send('add');
})
ipc.on('updateTable',()=>{
    initTable();
})
function warn(msg,id){
    $('#errorMsg').text(msg||'请检查输入');
    $('#confirmDel').data('id',id);
    $('#alertModal').modal();
}