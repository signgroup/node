<template>
    <div id="app">
        <nav v-if="$store.state.token">
            <router-link to="/">Home</router-link>|
            <router-link to="/about">About</router-link>
        </nav>
        <router-view/>
    </div>
</template>

<style lang="less">
    @import './assets/less/scoped.less';
    
    * {
        margin: 0;
        padding: 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
</style>
