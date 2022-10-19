import { pets } from '../models/data.js';
import { Pet } from '../models/pet.js';
import { Store } from '../Services/storage.js';
import { AddPet } from './add.pet.js';
import { Component } from './component.js';
import { ItemPet } from './item-pet.js';
export class PetList extends Component {
    constructor(selector) {
        super();
        this.selector = selector;
        this.storeService = new Store('Pets');
        if (this.storeService.getStore().length === 0) {
            this.pets = [...pets];
            this.storeService.setStore(this.pets);
        }
        else {
            this.pets = this.storeService.getStore();
        }
        this.manageComponent();
    }
    manageComponent() {
        this.template = this.createTemplate();
        this.render(this.selector, this.template);
        new AddPet('slot#add-pet', this.handleAdd.bind(this));
    }
    createTemplate() {
        let template = `<section>
                <h2>Pets</h2>
                <slot id="add-pet"></slot>
                <ul>`;
        this.pets.forEach((item) => {
            template += new ItemPet('', item, this.handlerEraser.bind(this), this.handlerAdopted.bind(this)).template;
        });
        template += `</ul>
            </section>`;
        return template;
    }
    handleAdd(ev) {
        ev.preventDefault();
        const name = document.querySelector('#name')
            .value;
        const race = document.querySelector('#race')
            .value;
        this.pets.push(new Pet(name, race));
        this.storeService.setStore(this.pets);
        this.manageComponent();
    }
    handlerEraser(deletedID) {
        this.pets = this.pets.filter((item) => item.id !== deletedID);
        this.storeService.setStore(this.pets);
        this.manageComponent();
    }
    handlerAdopted(changeID) {
        const i = this.pets.findIndex((item) => item.id === changeID);
        this.pets[i].isAdopted = !this.pets[i].isAdopted;
        this.storeService.setStore(this.pets);
    }
}
