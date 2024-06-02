<template>
  <div>
    <!--新增按钮-->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button>其它</el-button>
    </div>
    <!--引入搜索框-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="请输入关键字" style="width: 30%"></el-input>
      <el-button style="margin-left: 10px" type="primary">查询</el-button>
    </div>

    <!--将表格数据(即后端数据)放在HomeView.vue中-->
    <el-table :data="tableData" stripe style="width: 90%">
      <el-table-column sortable prop="id" label="ID"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="maker" label="制造商"/>
      <el-table-column prop="price" label="价格"/>
      <el-table-column prop="sales" label="销量"/>
      <el-table-column prop="stock" label="库存"/>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <!--自定义内容需要使用该行数据时，声明 #default="scope"，再通过 scope.row 获取当前行数据-->
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加家具的弹窗
      说明：
      1. el-dialog: v-model="dialogVisible" 表示对话框，和 dialogVisible 变量双向绑定，控制是否显示对话框
      2. el-form :model="form" 表示表单数据和 form数据变量 双向绑定
      3. el-input v-model="form.name" 表示表单的input控件，名字为name 需要和后台JavaBean[Furn]绑定
            这样到后台才会进行数据封装
    -->
    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="家具名">
          <el-input v-model="form.name" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="制造商">
          <el-input v-model="form.maker" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="form.sales" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="form.stock" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
// 引入request对象/组件
import request from "@/utils/request";

export default {
  // 导出，这样在HomeView.vue就可以使用HelloWorld组件
  name: 'HomeView',
  components: {},
  data() { // 数据部分
    return {
      form: {},   // 表单数据
      dialogVisible: false, // 控制对话框是否显示，默认为false
      search: '',
      tableData: []
    }
  },
  // 声明周期函数 created ，放在与 data、 methods 同等级别处
  created() { // 在此方法中，调用list()，完成表达数据的显示
    // 这个阶段组件的 data 和 methods 中的方法已初始化结束，可以访问。但dom结构未初始化，页面未渲染
    // 在这个阶段，经常会发起 Ajax 请求
    this.list();
  },
  methods: {  // 方法
    handleEdit(row) {
      // // 查看scope.row传过来的是什么东西，Proxy(Object)代理对象
      // console.log("row1=", row);
      // // 将其转换为JSON格式的字符串
      // console.log("row2=", JSON.stringify(row));
      // // 再从json格式的字符串构造JSON对象，即要发送的数据
      // console.log("row3=", JSON.parse(JSON.stringify(row)));

      // 把得到的数据和form绑定，显示对话框
      // 1. JSON.parse(JSON.stringify(row))对行数据进行了深拷贝
      // 2. 点击表格当前行的数据和弹出框的数据是独立的
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    // add方法，显示添加的对话框
    add() {
      // 每次显示添加的对话框时，清空表单数据
      this.form = {};
      this.dialogVisible = true;
    },
    // save方法，既完成添加家具操作，又负责修改家具操作
    save() {
      // 如何区分添加和修改操作？
      // 注意到，添加时add()将form置空`{}`；而修改时，form为当前行数据的深拷贝
      // 即，可以通过当前form的id是否为空，来区分是添加家具操作还是修改家具操作

      // 注意到，添加和修改分支中都包含刷新列表和关闭对话框的操作
      // 问：将这两句代码提出来放在if语句外面吗？
      // 答：不行！因为是通过axios发出的异步请求，如果刷新操作放在if语句外面而不是request请求的then语句中
      // 那么request所做的修改/添加请求，就无法保证与刷新请求之间的执行顺序。可能在还没完成request请求时，就已经刷新了！

      if (this.form.id) { // 执行修改
        request.put("/api/update", this.form).then(
            res => {
              if (res.code === "200") { // 修改成功
                // 提示修改成功
                this.$message({
                  type: "success",
                  message: res.message
                })
              } else {  // 修改失败
                this.$message({
                  type: "error",
                  message: "更新成功"
                })
              }
              // 刷新家具列表
              this.list();
              // 关闭对话框
              this.dialogVisible = false;
            }
        )
      } else {  // 执行添加
        // 在 vue.config.js 中配置了代理，将 /api 替换为 http://localhost:9090
        // 1. /api/save 真实对应的请求地址url 是 http://localhost:9090/save
        // 2. 当跨域执行请求时，浏览器还是提示 http://localhost:9090/api/save ，但不要认为是api没有进行替换
        request.post("/api/save", this.form).then(
            res => {  // 箭头函数，详见前端技术栈
              // res就是后端程序返回给前端的结果
              console.log("res=", res);
              this.dialogVisible = false;
              // 添加后刷新一下
              this.list();
            }
        )
      }

      // 不能在异步请求外面！
      // this.list();  // 刷新家具列表
      // this.dialogVisible = false; // 关闭对话框
    },
    // list方法，显示所有家具信息
    list() {
      request.get("/api/furns").then(res => {
        // console.log("res=", res);  // 通过控制台输出判断返回数据res中哪部分是家具列表
        // 将返回的数据和 tableData 绑定
        this.tableData = res.data;
      })
    }
  }
}
</script>
