<template>
  <div class="incredient">
    <div class="incredient__container" :class="{'expanded' : showFullIncredients}">
        <div class="incredient__ingredients__item" v-for="ingredient in item.Components" :key="ingredient">{{ ingredient }}</div>
    </div>
    <div v-if="!showFullIncredients" class="incredient__container__button" @click="showFullIncredients = !showFullIncredients">
        Näytä enemmän
    </div>
    <div v-else class="incredient__container__button" @click="showFullIncredients = !showFullIncredients">
        Näytä vähemmän
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
    private showFullIncredients = false;
    //@ts-ignore
    @Prop() item: FoodMenu;

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .incredient__container {
        height: 20px;
        overflow: hidden;
        
        &.expanded {
            height: initial;
        }
        
        &__button {
            color: #1a0dab;
            cursor: pointer;
        }
    }
</style>
