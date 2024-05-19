<template>
  <div>
    <!--新增按钮-->
    <div style="margin: 10px 0">
      <el-button type="primary">新增</el-button>
      <el-button>其它</el-button>
    </div>
    <!--引入搜索框-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="请输入关键字" style="width: 30%"></el-input>
      <el-button style="margin-left: 10px" type="primary">查询</el-button>
    </div>

    <!--将表格数据(即后端数据)放在HomeView.vue中-->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column sortable prop="date" label="日期"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="address" label="地址"/>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <!--自定义内容需要使用该行数据时，声明 #default="scope"，再通过 scope.row 获取当前行数据-->
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  // 导出，这样在HomeView.vue就可以使用HelloWorld组件
  name: 'HomeView',
  components: {},
  data() { // 数据部分
    return {
      search: '',
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: '狗熊岭',
        },
        {
          date: '2016-05-02',
          name: 'Jack',
          address: '四季村',
        },
        {
          date: '2016-05-04',
          name: 'Kim',
          address: '团结屯',
        },
        {
          date: '2016-05-01',
          name: 'Light',
          address: '龙虎山',
        },
      ]
    }
  },
  methods: {  // 方法
    handleEdit() {

    }
  }
}
</script>
