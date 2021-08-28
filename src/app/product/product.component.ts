import { Component, OnInit } from '@angular/core';
import { Product, ProductDetails } from './product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productObj: Product;
  productForm: FormGroup;
  wareHouse: Array<any> = [
    { key: 'wh1', value: 'Warehouse1' },
    { key: 'wh2', value: 'Warehouse2' },
  ];

  allWarehousesTypes: Array<any> = [
    { key: 'wh1', value: 'Type A' },
    { key: 'wh1', value: 'Type B' },
    { key: 'wh1', value: 'Type C' },
    { key: 'wh2', value: 'Type G' },
    { key: 'wh2', value: 'Type H' },
    { key: 'wh2', value: 'Type F' },
  ];
  warehouseTypes: Array<any> = [];

  products: Array<ProductDetails> = [
    { productId: 1, productName: "Product1", availableQuantity: 635, productType: "Type A" },
    { productId: 2, productName: "Product2", availableQuantity: 1025, productType: "Type B" },
    { productId: 3, productName: "Product3", availableQuantity: 0, productType: "Type A" },
    { productId: 4, productName: "Product4", availableQuantity: 32, productType: "Type D" },
    { productId: 5, productName: "Product5", availableQuantity: 15, productType: "Type B" },
    { productId: 6, productName: "Product6", availableQuantity: 0, productType: "Type D" },
  ];

  selectedProducts: Array<ProductDetails> = [];
  productSearchResult: Array<ProductDetails> = [];

  multipleDropdownSettings = {
    singleSelection: false,
    idField: 'productId',
    textField: 'productName',
    selectAllText: 'Select All',
    unSelectAllText: 'Select All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    maxHeight: 200,
  };

  isSpecificProduct: boolean = false;
  paginateConfig: { itemsPerPage: number; currentPage: number; totalItems: number; };
  enableSearch: boolean = false;


  constructor(private _formBuilder: FormBuilder) { }


  buildProductForm() {
    this.productForm = this._formBuilder.group({
      wareHouse: ['', [Validators.required]],
      type: ['', Validators.required],
      showZeroBalance: [],
      productClassification: [],
      product: ['', Validators.required],
    });
  }

  enableTypeControl() {
    const typeControl = this.productForm.get('type');
    this.productForm.get('wareHouse').valueChanges
      .subscribe(wh => {
        this.productObj.type = null;
        this.productSearchResult = [];
        if (wh) {
          typeControl.setValidators([Validators.required]);
          typeControl.enable();
          this.warehouseTypes = this.allWarehousesTypes.filter(t => t.key == wh)
        }
        else {
          typeControl.setValidators(null);
          typeControl.disable();
        }

        typeControl.updateValueAndValidity();

      });
  }

  enableProductClassificationControl() {
    const productClassificationControl = this.productForm.get('productClassification');
    this.productForm.get('type').valueChanges
      .subscribe(t => {
        this.productSearchResult = [];
        if (t) {
          productClassificationControl.enable();
          this.enableSearch = true;
        }
        else {
          productClassificationControl.disable();
          this.enableSearch = false;
        }
        productClassificationControl.updateValueAndValidity();
      });
  }

  onSearch() {
    this.productSearchResult = [];
    if (this.productObj.productClassification === 1) {
      this.selectedProducts.forEach(
        s => {
          let prItem = this.products.find(p => p.productId == s.productId);
          if (this.productObj.showZeroBalance) {
            this.productSearchResult.push(prItem);
          }
          else
            if (!this.productObj.showZeroBalance && prItem.availableQuantity != 0) {
              this.productSearchResult.push(prItem);
            }
        }
      );
      this.paginateConfig.totalItems = this.productSearchResult.length;
    }
    else {
      this.productSearchResult = this.productObj.showZeroBalance ? this.products :
        this.products.filter(pr => pr.availableQuantity != 0);

    }
  }

  selectSpecificProduct() {
    this.productSearchResult=[];
    this.isSpecificProduct = this.productObj.productClassification == 0 ? false : true;
  }

  pageChanged(event) {
    this.paginateConfig.currentPage = event;
  }

  ngOnInit(): void {
    this.productObj = new Product();
    this.productObj.productClassification = 0;
    this.buildProductForm();
    this.enableTypeControl();
    this.enableProductClassificationControl();
    this.paginateConfig = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.productSearchResult.length
    };
  }



}
