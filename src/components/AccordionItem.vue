<template>
    <div class="accordion_item">
        <div @click="isOpen = !isOpen" class="accordion_item__header">
            <div class="accordion_item__header__icon" :class="{ 'open' : isOpen }">
                <img src="../assets/arrow.png">
            </div>
            <div class="accordion_item__header__title">
                <div class="title">{{ lunchMenuItem.Name }}</div>
                <div class="price">{{ lunchMenuItem.Price }}</div>
            </div>
        </div>
        <transition name="accordion"
            v-on:before-enter="beforeEnter" v-on:enter="enter"
            v-on:before-leave="beforeLeave" v-on:leave="leave">
            <div v-show="isOpen" class="accordion_item__contents">
                <div class="accordion_item__contents__item" v-for="ingredient in lunchMenuItem.Components" :key="ingredient" v-html="ingredient"></div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AccordionItem extends Vue {

    //@ts-ignore
    @Prop() lunchMenuItem: {Name: string, Components: string[], Price: string};
    private isOpen = false;

    private beforeEnter(el: HTMLElement): void {
        el.style.height = '0';
    };
    private enter(el: HTMLElement): void {
        this.$nextTick(() => {
            el.style.height = el.scrollHeight + 'px';
        })
    };
    private beforeLeave(el: HTMLElement): void {
        el.style.height = el.scrollHeight + 'px';
    };
    private leave(el: HTMLElement): void {
        el.style.height = '0';
    };
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .accordion {
        &_item {

            &__contents {
                transition-duration: 0.3s;
                overflow: hidden;
                padding-left: 16px;
            }
            &__header {
                display: flex;
                align-items: center;
                cursor: pointer;

                &__title {
                    display: flex;
                    flex-direction: column;
                    color: #383838;
                    margin-left: 3px;
                    & > .title {
                        font-size: 14px;
                    }

                    & > .price {
                        font-size: 11px;
                        color: #7a7a7a;
                    }
                }

                &__icon {
                    
                    & > img {
                        width: 13px;
                        height: 13px;
                        transform: rotate(-90deg);
                        transition: all .3s ease;
                    }

                    &.open {
                        & > img {
                            transition: all .3s ease;
                            transform: rotate(0deg);
                        }
                    }
                }
            }
        }
    }
</style>
