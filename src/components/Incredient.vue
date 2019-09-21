<template>
  <div class="incredient">
    <div class="incredient__container" :class="{'expanded' : showFullIncredients}">
        <div class="incredient__ingredients__item" v-for="ingredient in item.Components" :key="ingredient" v-html="ingredient"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

interface FoodMenu {
    Price: string,
    Components: string[],
    Name: string,
}

@Component
export default class Incredient extends Vue {
    private showFullIncredients = true;
    //@ts-ignore
    @Prop() item: FoodMenu;

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .incredient__container {
        max-height: 20px;
        overflow: hidden;
        transition: max-height .3s linear;
        
        &.expanded {
            max-height: 100vh;
            transition: max-height .3s linear;
        }
        
        &__button {
            color: #1a0dab;
            cursor: pointer;
        }
    }
</style>
