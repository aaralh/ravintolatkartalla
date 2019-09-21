<template>
  <div class="search_bar" :class="{ 'expanded' : open }">
      <div class="search_bar__container">
        <input v-if="open" class="search_bar__container__input" :value="keywords" @input="keywords = $event.target.value" placeholder="Hae ravintolaa nimellä tai osoitteella">
        <div @click="open = !open" class="search_bar__container__icon">
            <i v-if="!open" class="fa fa-search" aria-hidden="true"></i>
            <i v-else class="fa fa-times" aria-hidden="true"></i>
        </div>
      </div>
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
    private open = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .search_bar {
        background-color: whitesmoke;
        width: 32px;
        transition: width .1s linear;
        border: 1px solid lightgray;
        &.expanded {
            width: calc(100vw - 20px);
            transition: width .1s linear;
        }

        &__container {
            height: 100%;
            &__input {
                width: 100%;
                height: 100%;
                text-indent: 5px;
                outline: none;
            }

            &__icon {
                position: absolute;
                font-size: 18px;
                height: 100%;
                width: 32px;
                right: 0px;
                top: 0px;
                cursor: pointer;

                & > i {
                    position: absolute;
                    right: 6px;
                    top: 6px;
                }
            }
        }
    }
</style>
