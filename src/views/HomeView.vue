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
      <el-button style="margin-left: 10px" type="primary" @click="list">查询</el-button>
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
          <!--
          handleEdit方法从当前前端页面数据拿到当前行的家具信息，可能得到的数据不是最新的
          handleEdit2方法拿到当前行数据id后，重新向DB发出请求获取家具信息
          -->
          <el-button type="text" @click="handleEdit2(scope.row)">编辑</el-button>
          <!--引入一个确认框-->
          <!--<el-button type="text" @click="">删除</el-button>-->
          <el-popconfirm title="确定删除吗？" @confirm="handleDel(scope.row.id)">
            <template #reference>
              <el-button type="text">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--引入分页组件，可以根据自己的需要进行定制
      layout属性指示导航条显示哪些部分
    -->
    <div style="margin: 10px 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <!--添加家具的弹窗
      说明：
      1. el-dialog: v-model="dialogVisible" 表示对话框，和 dialogVisible 变量双向绑定，控制是否显示对话框
      2. el-form :model="form" 表示表单数据和 form数据变量 双向绑定
      3. el-input v-model="form.name" 表示表单的input控件，名字为name 需要和后台JavaBean[Furn]绑定
            这样到后台才会进行数据封装
    -->
    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <!--增加表单验证-->
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <!--prop表示和rules的哪个规则关联-->
        <el-form-item label="家具名" prop="name">
          <el-input v-model="form.name" style="width: 50%"/>
          <!--显示返回的后端校验信息-vue插入表达式-->
          {{validMsg.name}}
        </el-form-item>
        <el-form-item label="制造商" prop="maker">
          <el-input v-model="form.maker" style="width: 50%"/>
          {{validMsg.maker}}
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" style="width: 50%"/>
          {{validMsg.price}}
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input v-model="form.sales" style="width: 50%"/>
          {{validMsg.sales}}
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" style="width: 50%"/>
          {{validMsg.stock}}
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
      // 关联后端校验数据/信息
      validMsg: {},
      // 分页显示相关参数
      currentPage: 1,   // 当前页
      pageSize: 5,      // 每页显示几条记录
      total: 10,        // 总共有多少页，会通过请求获得表中对应的记录
      form: {},   // 表单数据
      dialogVisible: false, // 控制对话框是否显示，默认为false
      search: '',
      tableData: [],
      rules: {    // 提交表单的验证规则
        name: [
          {required: true, message: '请输入家具名', trigger: 'blur'}
        ],
        maker: [
          {required: true, message: '请输入厂商名', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入价格', trigger: 'blur'},
          {pattern: /^(([1-9]\d*)|0)(\.\d+)?$/, message: '请输入数字', trigger: 'blur'}
        ],
        sales: [
          {required: true, message: '请输入销量', trigger: 'blur'},
          {pattern: /^(([1-9]\d*)|0)$/, message: '请输入数字', trigger: 'blur'}
        ],
        stock: [
          {required: true, message: '请输入库存', trigger: 'blur'},
          {pattern: /(([1-9]\d*)|0)/, message: '请输入数字', trigger: 'blur'}
        ]
      }
    }
  },
  // 声明周期函数 created ，放在与 data、 methods 同等级别处
  created() { // 在此方法中，调用list()，完成表达数据的显示
    // 这个阶段组件的 data 和 methods 中的方法已初始化结束，可以访问。但dom结构未初始化，页面未渲染
    // 在这个阶段，经常会发起 Ajax 请求
    this.list();
  },
  methods: {  // 方法
    // 处理修改pageSize的变化
    handlePageSizeChange(pageSize) {  // 通过导航栏改变pageSize时，底层机制会自动传过来
      this.pageSize = pageSize;
      this.list();  // 刷新家具列表
    },
    // 处理 currentPage 的变化
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.list();  // 刷新家具列表
    },
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
    // 新回显函数，点击编辑按钮时从DB中获取数据
    handleEdit2(row) {
      // console.log("row=", row);
      // console.log("row.id=", row.id);  // 虽然从handleEdit看row是代理对象，但是通过row.id也可以获取到对象的id
      request.get(`/api/get/${row.id}`).then(res => {
        // console.log("res=", res);
        // console.log("res.data=", res.data);
        if (res.code === "200") { // 查询成功
          this.form = res.data;
          this.dialogVisible = true;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    },
    // add方法，显示添加的对话框
    add() {
      // 每次显示添加的对话框时，清空表单数据
      this.form = {};
      this.dialogVisible = true;
      // 将上次表单验证的信息清空
      this.$refs['form'].resetFields();
      // 清空上次后端校验信息
      this.validMsg = {};
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
        // 1) 添加-无数据校验
        // 在 vue.config.js 中配置了代理，将 /api 替换为 http://localhost:9090
        // 1. /api/save 真实对应的请求地址url 是 http://localhost:9090/save
        // 2. 当跨域执行请求时，浏览器还是提示 http://localhost:9090/api/save ，但不要认为是api没有进行替换
        // request.post("/api/save", this.form).then(
        //     res => {  // 箭头函数，详见前端技术栈
        //       // res就是后端程序返回给前端的结果
        //       console.log("res=", res);
        //       this.dialogVisible = false;
        //       // 添加后刷新一下
        //       this.list();
        //     }
        // )

        // 2) 添加-数据校验版，如果验证没有通过就不提交
        this.$refs['form'].validate((valid) => {
          // alert(valid); // 通过：true
          // 测试一下，先将valid置为true
          // valid = true;
          if (valid) {  // 前端校验通过
            request.post("/api/save", this.form).then(res => {
              if (res.code === "200") { // 后端校验通过，添加成功
                // this.dialogVisible = true;
                this.dialogVisible = false;
                this.list();
              } else if (res.code === "400") {  // 后端校验失败
                // 取出返回的校验错误信息
                this.validMsg.name = res.data.name;
                this.validMsg.maker = res.data.maker;
                this.validMsg.price = res.data.price;
                this.validMsg.sales = res.data.sales;
                this.validMsg.stock = res.data.stock;
              }
            })
          } else {  // 验证失败
            this.$message({
              type: "error",
              message: "验证未通过！"
            })
            // 只有返回false，确定按钮才没有提交请求
            return false;
          }
        })
      }

      // 不能在异步请求外面！
      // this.list();  // 刷新家具列表
      // this.dialogVisible = false; // 关闭对话框
    },
    // list方法，显示所有家具信息
    list() {
      // 1) 查询全部
      // request.get("/api/furns").then(res => {
      //   // console.log("res=", res);  // 通过控制台输出判断返回数据res中哪部分是家具列表
      //   // 将返回的数据和 tableData 绑定
      //   this.tableData = res.data;
      // })

      // 2) 分页查询
      // 使用模板字符串拼接参数值
      // request.get(`/api/furnByPage?pageNum=${this.currentPage}&pageSize=${this.pageSize}`)
      // request.get("/api/furnByPage", {
      //   params: {
      //     "pageNum": this.currentPage,
      //     "pageSize": this.pageSize,
      //   }
      // }).then(res => {
      //   // 先查看一下后端分页请求返回数据的格式
      //   // console.log("res=", res);
      //   this.total = res.data.total;  // 修改总记录为查询返回的结果
      //   this.tableData = res.data.records;
      // });

      // 3) 条件分页查询
      request.get("/api/furnBySearchPage2", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.records;
      })
    },
    // 处理删除家具，传入家具id
    handleDel(id) {
      // 模板字符串 ``
      request.delete(`/api/del/${id}`).then(res => {
        // console.log("id=", id);
        if (res.code === "200") {
          this.$message({
            type: "success",
            message: "删除成功"
          })
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
        // 刷新列表
        this.list();
      })
    }
  }
}
</script>
