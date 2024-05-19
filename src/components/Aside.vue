<script setup>

</script>

<template>
  <div>
    <!-- 说明-->
    <!-- 先去掉, 这两个方法, 否则会报错-->
    <!-- @open="handleOpen"-->
    <!-- @close="handleClose"-->
    <el-menu
        style="width: 200px"
        default-active="1"
        class="el-menu-vertical-demo">
      <el-sub-menu index="1">
        <template #title>选项一</template>
        <el-menu-item index="1-1">选项 1</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <template #title>导航二</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>

</style>