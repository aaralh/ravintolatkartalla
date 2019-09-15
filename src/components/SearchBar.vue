<template>
  <div class="search_bar">
      <input class="search_bar__input" v-model="keywords" placeholder="Hae ravintolaa nimellä tai osoitteella">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component<SearchBar>({
    watch: {
        keywords: function(newVal: string): void {
            this.$emit("input", newVal);
        }
    }
})
export default class SearchBar extends Vue {
    //@ts-ignore
    @Prop() value: string;
    private keywords: string = "";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .search_bar {
        background-color: whitesmoke;
        &__input {
            width: 100%;
            height: 90%;
            text-indent: 5px;
        }
    }
</style>
