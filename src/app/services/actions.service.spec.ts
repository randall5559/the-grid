/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActionsService } from './actions.service';
import { StateManagerService } from 'sassy-state-manager-ng2';
import {
  TotalRow,
  Agency,
  Property,
  Advertiser,
  DashboardAdvertiser,
  DashboardAgency,
  DashboardTotal,
  OptionModel,
  Row,
  BaseEntity
} from '../interfaces';
import {
  RowTypes,
  AggregationalColumns,
  OptionModelTypes,
  FilterEvaluationStrategies
} from '../enums/enums';


describe('ActionsService', () => {

  let functionToTest: Function,
    Actions: ActionsService,
    StateManager: StateManagerService;

  /** Mock State Manager */
  class MockStateManager {
    public update() {
      return (_method) => {
        functionToTest = _method;
      };
    }
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        ActionsService,
        { provide: StateManagerService, useClass: MockStateManager }
      ]
    });

  });

  beforeEach(inject([ActionsService, StateManagerService], (_ActionsService_, _StateManagerService_) => {
    Actions = _ActionsService_;
    StateManager = _StateManagerService_;

    spyOn(StateManager, 'update').and.callThrough();
  }));


  describe('Parse Agency Model', () => {

    beforeEach(() => {
      Actions.parseAgencyModel(generateMockRawModel());
    });

    it('create a total row', () => {
      let total_rows: TotalRow[] = functionToTest().filter(row => row.type === RowTypes.Total);
      expect(total_rows.length).toEqual(1);
      expect(total_rows[0].advertisers).toEqual([3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 20]);
      expect(total_rows[0].agencies).toEqual([1, 18]);
      expect(total_rows[0].collapsed).toEqual(false);
      expect(total_rows[0].id).toEqual(0);
      expect(total_rows[0].isFiltered).toEqual(false);
      expect(total_rows[0].projection).toEqual(generateMockRawModel().reduce((acc, row) => row['projection'] + acc, 0));
      expect(total_rows[0].properties).toEqual([2, 4, 13, 19]);
      expect(total_rows[0].registration).toEqual(generateMockRawModel().reduce((acc, row) => row['registration'] + acc, 0));
      expect(total_rows[0].showChildren).toEqual(true);
      expect(total_rows[0].spend).toEqual(generateMockRawModel().reduce((acc, row) => row['spend'] + acc, 0));
      expect(total_rows[0].type).toEqual(RowTypes.Total);
      expect(total_rows[0].agency_spend).toEqual(generateMockRawModel().reduce((acc, row) => row['agency_spend'] + acc, 0));
      expect(total_rows[0].variance).toEqual(997173);
    });

    it('create agency rows', () => {
      let agency_rows: Agency[] = functionToTest().filter(row => row.type === RowTypes.Agency);
      expect(agency_rows.length).toEqual(2);

      /** Agency 1: Hearts & Science */
      expect(agency_rows[0].advertisers).toEqual([3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17]);
      expect(agency_rows[0].agency_name).toEqual('Hearts & Science');
      expect(agency_rows[0].collapsed).toEqual(false);
      expect(agency_rows[0].id).toEqual(1);
      expect(agency_rows[0].isFiltered).toEqual(true);
      expect(agency_rows[0].projection).toEqual(
        generateMockRawModel()
          .filter(row => row.agency_name === 'Hearts & Science')
          .reduce((acc, row) => row['projection'] + acc, 0)
      );
      expect(agency_rows[0].properties).toEqual([2, 4, 13]);
      expect(agency_rows[0].registration).toEqual(
        generateMockRawModel()
          .filter(row => row.agency_name === 'Hearts & Science')
          .reduce((acc, row) => row['registration'] + acc, 0)
      );
      expect(agency_rows[0].showChildren).toEqual(false);
      expect(agency_rows[0].spend).toEqual(
        generateMockRawModel()
          .filter(row => row.agency_name === 'Hearts & Science')
          .reduce((acc, row) => row['spend'] + acc, 0)
      );
      expect(agency_rows[0].type).toEqual(RowTypes.Agency);
      expect(agency_rows[0].agency_spend).toEqual(
        generateMockRawModel()
          .filter(row => row.agency_name === 'Hearts & Science')
          .reduce((acc, row) => row['agency_spend'] + acc, 0)
      );
      expect(agency_rows[0].variance).toEqual(997173);

      /** Agency 2: OMD USA */
      expect(agency_rows[1].advertisers).toEqual([20]);
      expect(agency_rows[1].agency_name).toEqual('OMD USA');
      expect(agency_rows[1].collapsed).toEqual(false);
      expect(agency_rows[1].id).toEqual(18);
      expect(agency_rows[1].isFiltered).toEqual(true);
      expect(agency_rows[1].projection).toEqual(
        generateMockRawModel()
          .filter(row => row.agency_name === 'OMD USA')
          .reduce((acc, row) => row['projection'] + acc, 0)
      );
      expect(agency_rows[1].properties).toEqual([19]);
      expect(agency_rows[1].registration).toEqual(
        generateMockRawModel()
          .filter(row => row.agency_name === 'OMD USA')
          .reduce((acc, row) => row['registration'] + acc, 0)
      );
      expect(agency_rows[1].showChildren).toEqual(false);
      expect(agency_rows[1].spend).toEqual(
        generateMockRawModel()
          .filter(row => row.agency_name === 'OMD USA')
          .reduce((acc, row) => row['spend'] + acc, 0)
      );
      expect(agency_rows[1].type).toEqual(RowTypes.Agency);
      expect(agency_rows[1].agency_spend).toEqual(
        generateMockRawModel()
          .filter(row => row.agency_name === 'OMD USA')
          .reduce((acc, row) => row['agency_spend'] + acc, 0)
      );
      expect(agency_rows[1].variance).toEqual(0);
    });

    it('create property rows', () => {
      let property_rows: Property[] = functionToTest().filter(row => row.type === RowTypes.Property);
      expect(property_rows.length).toEqual(4);

      /** Property 1: All Night */
      expect(property_rows[0].advertisers).toEqual([3]);
      expect(property_rows[0].agency_id).toEqual(1);
      expect(property_rows[0].collapsed).toEqual(true);
      expect(property_rows[0].id).toEqual(2);
      expect(property_rows[0].isFiltered).toEqual(true);
      expect(property_rows[0].projection).toEqual(
        generateMockRawModel()
          .filter((row) => row.property_name === 'All Night' && row.agency_name === 'Hearts & Science')
          .reduce((acc, row) => row['projection'] + acc, 0)
      );
      expect(property_rows[0].property_name).toEqual('All Night');
      expect(property_rows[0].registration).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'All Night' && row.agency_name === 'Hearts & Science')
          .reduce((acc, row) => row['registration'] + acc, 0)
      );
      expect(property_rows[0].showChildren).toEqual(false);
      expect(property_rows[0].spend).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'All Night' && row.agency_name === 'Hearts & Science')
          .reduce((acc, row) => row['spend'] + acc, 0)
      );
      expect(property_rows[0].type).toEqual(RowTypes.Property);
      expect(property_rows[0].agency_spend).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'All Night' && row.agency_name === 'Hearts & Science')
          .reduce((acc, row) => row['agency_spend'] + acc, 0)
      );
      expect(property_rows[0].variance).toEqual(0);

      /** Property 2: Bravo */
      expect(property_rows[1].advertisers).toEqual([5, 6, 7, 8, 9, 10, 11, 12]);
      expect(property_rows[1].agency_id).toEqual(1);
      expect(property_rows[1].collapsed).toEqual(true);
      expect(property_rows[1].id).toEqual(4);
      expect(property_rows[1].isFiltered).toEqual(true);
      expect(property_rows[1].projection).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'Bravo')
          .reduce((acc, row) => row['projection'] + acc, 0)
      );
      expect(property_rows[1].property_name).toEqual('Bravo');
      expect(property_rows[1].registration).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'Bravo')
          .reduce((acc, row) => row['registration'] + acc, 0)
      );
      expect(property_rows[1].showChildren).toEqual(false);
      expect(property_rows[1].spend).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'Bravo')
          .reduce((acc, row) => row['spend'] + acc, 0)
      );
      expect(property_rows[1].type).toEqual(RowTypes.Property);
      expect(property_rows[1].agency_spend).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'Bravo')
          .reduce((acc, row) => row['agency_spend'] + acc, 0)
      );
      expect(property_rows[1].variance).toEqual(997173);

      /** Property 3: CNBC - Business Day */
      expect(property_rows[2].advertisers).toEqual([14, 15, 16, 17]);
      expect(property_rows[2].agency_id).toEqual(1);
      expect(property_rows[2].collapsed).toEqual(true);
      expect(property_rows[2].id).toEqual(13);
      expect(property_rows[2].isFiltered).toEqual(true);
      expect(property_rows[2].projection).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'CNBC - Business Day')
          .reduce((acc, row) => row['projection'] + acc, 0)
      );
      expect(property_rows[2].property_name).toEqual('CNBC - Business Day');
      expect(property_rows[2].registration).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'CNBC - Business Day')
          .reduce((acc, row) => row['registration'] + acc, 0)
      );
      expect(property_rows[2].showChildren).toEqual(false);
      expect(property_rows[2].spend).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'CNBC - Business Day')
          .reduce((acc, row) => row['spend'] + acc, 0)
      );
      expect(property_rows[2].type).toEqual(RowTypes.Property);
      expect(property_rows[2].agency_spend).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'CNBC - Business Day')
          .reduce((acc, row) => row['agency_spend'] + acc, 0)
      );
      expect(property_rows[2].variance).toEqual(0);

      /** Property 4: Prime Time */
      expect(property_rows[3].advertisers).toEqual([20]);
      expect(property_rows[3].agency_id).toEqual(18);
      expect(property_rows[3].collapsed).toEqual(true);
      expect(property_rows[3].id).toEqual(19);
      expect(property_rows[3].isFiltered).toEqual(true);
      expect(property_rows[3].projection).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'All Night' && row.agency_name === 'OMD USA')
          .reduce((acc, row) => row['projection'] + acc, 0)
      );
      expect(property_rows[3].property_name).toEqual('All Night');
      expect(property_rows[3].registration).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'All Night' && row.agency_name === 'OMD USA')
          .reduce((acc, row) => row['registration'] + acc, 0)
      );
      expect(property_rows[3].showChildren).toEqual(false);
      expect(property_rows[3].spend).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'All Night' && row.agency_name === 'OMD USA')
          .reduce((acc, row) => row['spend'] + acc, 0)
      );
      expect(property_rows[3].type).toEqual(RowTypes.Property);
      expect(property_rows[3].agency_spend).toEqual(
        generateMockRawModel()
          .filter(row => row.property_name === 'All Night' && row.agency_name === 'OMD USA')
          .reduce((acc, row) => row['agency_spend'] + acc, 0)
      );
      expect(property_rows[3].variance).toEqual(0);
    });

    describe('update advertiser rows', () => {

      let advertiser_rows: Advertiser[],
        full_model;

      beforeEach(() => {
        full_model = functionToTest();
        advertiser_rows = full_model.filter(row => row.type === RowTypes.Advertiser);
      });

      it('keep all original advertiser rows', () => {
        expect(advertiser_rows.length).toEqual(generateMockRawModel().length);
      });

      it('adds new attributes to each advertiser', () => {
        let property_id, agency_id;

        full_model
          .forEach((row: Agency | Property | Advertiser, id: number) => {
            if (row.type === RowTypes.Agency) {
              agency_id = row.id;
            }
            if (row.type === RowTypes.Property) {
              property_id = row.id;
            }
            if (row.type === RowTypes.Advertiser) {
              expect(row.type).toEqual(RowTypes.Advertiser);
              expect(row.comments).toEqual([]);
              expect(row.collapsed).toEqual(true);
              expect(row.isFiltered).toEqual(true);
              expect(row.property_id).toEqual(property_id);
              expect(row.agency_id).toEqual(agency_id);
              expect(row.showChildren).toEqual(null);
              expect(row.variance).toEqual(row.agency_spend - row.spend);
            }
          });
      });

      it('persists original data attributes', () => {
        let orig_model = generateMockRawModel();
        advertiser_rows
          .forEach((row: Advertiser, index: number) => {
            expect(row.selling_vertical === orig_model[index].selling_vertical).toBeTruthy();
            expect(row.advertiser_name === orig_model[index].advertiser_name).toBeTruthy();
            expect(row.deal_tag === orig_model[index].deal_tag).toBeTruthy();
            expect(row.sales_type === orig_model[index].sales_type).toBeTruthy();
            expect(row.demo === orig_model[index].demo).toBeTruthy();
            expect(row.guaranteed_cpm === orig_model[index].guaranteed_cpm).toBeTruthy();
            expect(row.spend === orig_model[index].spend).toBeTruthy();
            expect(row.registration === orig_model[index].registration).toBeTruthy();
            expect(row.projection === orig_model[index].projection).toBeTruthy();
            expect(row.agency_spend === orig_model[index].agency_spend).toBeTruthy();
          });
      });

    });

  });


  describe('Toggle Collapsing Rows', () => {

    let parsedModel;

    beforeEach(() => {
      Actions.parseAgencyModel(generateMockRawModel());
      parsedModel = functionToTest().slice(0);
    });

    describe('Agency Row', () => {

      it('show an Agency row', () => {
        Actions.toggleAgency(1);
        let updated_model = functionToTest(parsedModel);
        expect(<Agency>updated_model[1].collapsed).toBeFalsy();
        expect(<Agency>updated_model[1].showChildren).toBeTruthy();
      });

      it('hide an Agency row', () => {
        parsedModel[1] = Object.assign({}, parsedModel[1], {
          collapsed: true,
          showChildren: false
        });
        Actions.toggleAgency(1);
        let updated_model = functionToTest(parsedModel);
        expect(<Agency>updated_model[1].collapsed).toBeTruthy();
        expect(<Agency>updated_model[1].showChildren).toBeTruthy();
      });

      it('shows all the Properties and keeps the Advertisers hidden', () => {
        Actions.toggleAgency(1);
        let updated_model = functionToTest(parsedModel);
        // Advertisers
        [3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17]
          .forEach((index) => {
            expect(<Advertiser>updated_model[index].collapsed).toBeTruthy();
            expect(<Advertiser>updated_model[index].showChildren).toBe(null);
          });
        // Properties
        [2, 4, 13]
          .forEach((index) => {
            expect(<Property>updated_model[index].collapsed).toBeFalsy();
            expect(<Property>updated_model[index].showChildren).toBeFalsy();
          });
      });

      it('hides all the open Advertisers and Properties', () => {
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
          .forEach(index => {
            parsedModel[index] = Object.assign({}, parsedModel[index], {
              collapsed: false,
              showChildren: parsedModel[index].type !== RowTypes.Advertiser
            });
          });
        Actions.toggleAgency(1);
        let updated_model = functionToTest(parsedModel);

        // check all advertisers and properties
        [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
          .forEach(index => {
            expect(<Agency | Property | Advertiser>updated_model[index].collapsed).toBeTruthy();
            expect(<Agency | Property | Advertiser>updated_model[index].showChildren).toBeFalsy();
          });

        // check the agency
        expect(<Agency | Property | Advertiser>updated_model[1].collapsed).toBeFalsy();
        expect(<Agency | Property | Advertiser>updated_model[1].showChildren).toBeFalsy();
      });

    });

    describe('Property Row', () => {

      it('show a Property row', () => {
        parsedModel[4] = Object.assign({}, parsedModel[4], {
          collapsed: false,
          showChildren: false
        });
        Actions.toggleProperty(4);
        let updated_model = functionToTest(parsedModel);
        expect(<Property>updated_model[4].collapsed).toBeFalsy();
        expect(<Property>updated_model[4].showChildren).toBeTruthy();
      });

      it('hide a Property row', () => {
        parsedModel[4] = Object.assign({}, parsedModel[4], {
          collapsed: false,
          showChildren: true
        });
        Actions.toggleProperty(4);
        let updated_model = functionToTest(parsedModel);
        expect(<Property>updated_model[4].collapsed).toBeFalsy();
        expect(<Property>updated_model[4].showChildren).toBeFalsy();
      });

      it('showing a Property should show it Advertisers', () => {
        Actions.toggleProperty(4);
        let updated_model = functionToTest(parsedModel);
        [5, 6, 7, 8, 9, 10, 11, 12]
          .forEach((index) => {
            expect(<Advertiser>updated_model[index].collapsed).toBeFalsy();
            expect(<Advertiser>updated_model[index].showChildren).toBe(null);
          });
      });

      it('hiding a Property should hide it Advertisers', () => {
        parsedModel[4] = Object.assign({}, parsedModel[4], {
          collapsed: false,
          showChildren: true
        });
        [5, 6, 7, 8, 9, 10, 11, 12]
          .forEach(index => {
            parsedModel[index] = Object.assign({}, parsedModel[index], {
              collapsed: false
            });
          });
        Actions.toggleProperty(4);
        let updated_model = functionToTest(parsedModel);
        [5, 6, 7, 8, 9, 10, 11, 12]
          .forEach((index) => {
            expect(<Advertiser>updated_model[index].collapsed).toBeTruthy();
            expect(<Advertiser>updated_model[index].showChildren).toBe(null);
          });
      });

    });

  });


  describe('Update Values', () => {

    let parsedModel;

    beforeEach(() => {
      Actions.parseAgencyModel(generateMockRawModel());
      parsedModel = functionToTest().slice(0);
    });


    describe('Advertiser', () => {

      it('updates the single advertiser value and its ancestors', () => {
        Actions.updateAdvertiserValue(3, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertiser
        expect(new_model[3].spend).toEqual(100000);
        // property
        expect(new_model[2].spend).toEqual(100000);
        // agency
        expect(new_model[1].spend).toEqual(
          [5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 100000)
        );
        // total
        expect(new_model[0].spend).toEqual(
          [5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 20].reduce((acc, index) => acc + new_model[index].spend, 100000)
        );
      });

      it('updates the single advertiser variance and its ancestor\'s variance', () => {
        Actions.updateAdvertiserValue(3, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertiser
        expect(new_model[3].variance).toEqual(new_model[3].agency_spend - 100000);
        // property
        expect(new_model[2].variance).toEqual(new_model[2].agency_spend - new_model[2].spend);
        // agency
        expect(new_model[1].variance).toEqual(new_model[1].agency_spend - new_model[1].spend);
        // total
        expect(new_model[0].variance).toEqual(new_model[0].agency_spend - new_model[0].spend);
      });

    });


    describe('Agency', () => {

      it('update all the advertisers and their ancestors', () => {
        Actions.updateAgencyValue(1, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertsiers
        [3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17]
          .forEach(index => {
            let ratio = parsedModel[index].spend / parsedModel[1].spend;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // property
        expect(new_model[2].spend).toEqual(new_model[3].spend);
        expect(new_model[4].spend).toEqual(
          [5, 6, 7, 8, 9, 10, 11, 12].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[13].spend).toEqual(
          [14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        // agency
        expect(Math.round(new_model[1].spend)).toEqual(100000);
        // total
        expect(new_model[0].spend).toEqual(100000 + new_model[18].spend);
      });

      it('when all advertisers are 0, it distributes the value equally', () => {
        [3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17]
          .forEach(index => {
            parsedModel[index] = Object.assign({}, parsedModel[index], {
              spend: 0
            });
          });
        Actions.updateAgencyValue(1, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertsiers
        [3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17]
          .forEach(index => {
            let ratio = 1 / 13;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // property(s)
        expect(new_model[2].spend).toEqual(new_model[3].spend);
        expect(new_model[4].spend).toEqual(
          [5, 6, 7, 8, 9, 10, 11, 12].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[13].spend).toEqual(
          [14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        // agency
        expect(Math.round(new_model[1].spend)).toEqual(100000);
        // total
        expect(new_model[0].spend).toEqual(100000 + new_model[18].spend);
      });

      it('update all the advertiser variances and their ancestor\'s variance', () => {
        Actions.updateAgencyValue(1, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
          .forEach(index => {
            expect(new_model[index].variance).toEqual(new_model[index].agency_spend - new_model[index].spend);
          });
      });

      it('ignore filtered advertiser records', () => {
        parsedModel[7] = Object.assign({}, parsedModel[7], { isFiltered: false });
        let excluded_spend = parsedModel[7].spend;

        // re-calculate the model
        Actions.recalculateEntireModel();
        parsedModel = functionToTest(parsedModel);

        // update the agency value
        Actions.updateAgencyValue(1, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);

        // advertsiers, exclude 7
        [3, 5, 6, 8, 9, 10, 11, 12, 14, 15, 16, 17]
          .forEach(index => {
            let ratio = parsedModel[index].spend / parsedModel[1].spend;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // advertiser 7, should not be modified
        expect(new_model[7].spend).toEqual(excluded_spend);
        // property
        expect(new_model[2].spend).toEqual(new_model[3].spend);
        expect(new_model[4].spend).toEqual(
          [5, 6, 8, 9, 10, 11, 12].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[13].spend).toEqual(
          [14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        // agency
        expect(Math.round(new_model[1].spend)).toEqual(100000);
        // total
        expect(Math.round(new_model[0].spend)).toEqual(100000 + new_model[18].spend);
      });

    });


    describe('Property', () => {

      it('update all the advertisers and their ancestors', () => {
        Actions.updatePropertyValue(4, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertsiers
        [5, 6, 7, 8, 9, 10, 11, 12]
          .forEach(index => {
            let ratio = parsedModel[index].spend / parsedModel[4].spend;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // property
        expect(new_model[4].spend).toEqual(100000);
        // agency
        expect(new_model[1].spend).toEqual(100000 + new_model[2].spend + new_model[13].spend);
        // total
        expect(new_model[0].spend).toEqual(100000 + new_model[2].spend + new_model[13].spend + new_model[19].spend);
      });

      it('when all advertisers are 0, it distributes the value equally', () => {
        [5, 6, 7, 8, 9, 10, 11, 12]
          .forEach(index => {
            parsedModel[index] = Object.assign({}, parsedModel[index], {
              spend: 0
            });
          });
        Actions.updatePropertyValue(4, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertsiers
        [5, 6, 7, 8, 9, 10, 11, 12]
          .forEach(index => {
            let ratio = 1 / 8;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // property
        expect(new_model[4].spend).toEqual(100000);
        // agency
        expect(new_model[1].spend).toEqual(100000 + new_model[2].spend + new_model[13].spend);
        // total
        expect(new_model[0].spend).toEqual(100000 + new_model[2].spend + new_model[13].spend + new_model[19].spend);
      });

      it('update all the advertiser variances and their ancestor\'s variance', () => {
        Actions.updatePropertyValue(4, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        [0, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          .forEach(index => {
            expect(new_model[index].variance).toEqual(new_model[index].agency_spend - new_model[index].spend);
          });
      });

      it('ignore filtered advertiser records', () => {
        parsedModel[7] = Object.assign({}, parsedModel[7], { isFiltered: false });
        let excluded_spend = parsedModel[7].spend;

        // re-calculate the model
        Actions.recalculateEntireModel();
        parsedModel = functionToTest(parsedModel);

        Actions.updatePropertyValue(4, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);

        // advertsiers
        [5, 6, 8, 9, 10, 11, 12]
          .forEach(index => {
            let ratio = parsedModel[index].spend / parsedModel[4].spend;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // advertiser 7, should not be modified
        expect(new_model[7].spend).toEqual(excluded_spend);
        // property
        expect(new_model[4].spend).toEqual(100000);
        // agency
        expect(new_model[1].spend).toEqual(100000 + new_model[2].spend + new_model[13].spend);
        // total
        expect(new_model[0].spend).toEqual(100000 + new_model[2].spend + new_model[13].spend + new_model[19].spend);
      });

    });


    describe('Total', () => {

      it('updates all advertisers and updates their ancestors', () => {
        Actions.updateTotalValue(0, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertsiers
        [3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 20]
          .forEach(index => {
            let ratio = parsedModel[index].spend / parsedModel[0].spend;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // property
        expect(new_model[2].spend).toEqual(new_model[3].spend);
        expect(new_model[4].spend).toEqual(
          [5, 6, 7, 8, 9, 10, 11, 12].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[13].spend).toEqual(
          [14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[19].spend).toEqual(
          [20].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        // agency
        expect(Math.round(new_model[1].spend)).toEqual(
          Math.round([3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0))
        );
        expect(Math.round(new_model[18].spend)).toEqual(Math.round(new_model[20].spend));
        // total
        expect(new_model[0].spend).toEqual(100000);
      });

      it('when all advertisers are 0, it distributes the value equally', () => {
        [3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 20]
          .forEach(index => {
            parsedModel[index] = Object.assign({}, parsedModel[index], {
              spend: 0
            });
          });
        Actions.updateTotalValue(0, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertsiers
        [3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 20]
          .forEach(index => {
            let ratio = 1 / 14;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // property(s)
        expect(new_model[2].spend).toEqual(new_model[3].spend);
        expect(new_model[4].spend).toEqual(
          [5, 6, 7, 8, 9, 10, 11, 12].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[13].spend).toEqual(
          [14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[19].spend).toEqual(
          [20].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        // agency
        expect(Math.round(new_model[1].spend)).toEqual(
          Math.round([3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0))
        );
        expect(Math.round(new_model[18].spend)).toEqual(
          Math.round([20].reduce((acc, index) => acc + new_model[index].spend, 0))
        );
        // total
        expect(Math.round(new_model[0].spend)).toEqual(100000);
      });

      it('update all the advertiser variances and their ancestor\'s variance', () => {
        Actions.updateTotalValue(0, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);

        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
          .forEach(index => {
            expect(new_model[index].variance).toEqual(new_model[index].agency_spend - new_model[index].spend);
          });
      });

      it('ignore filtered advertiser records', () => {
        parsedModel[7] = Object.assign({}, parsedModel[7], { isFiltered: false });
        let excluded_spend = parsedModel[7].spend;

        // re-calculate the model
        Actions.recalculateEntireModel();
        parsedModel = functionToTest(parsedModel);

        Actions.updateTotalValue(0, AggregationalColumns.spend, 100000);
        let new_model = functionToTest(parsedModel);
        // advertsiers
        [3, 5, 6, 8, 9, 10, 11, 12, 14, 15, 16, 17, 20]
          .forEach(index => {
            let ratio = parsedModel[index].spend / parsedModel[0].spend;
            expect(new_model[index].spend).toEqual(100000 * ratio);
          });
        // advertiser 7, should not be modified
        expect(new_model[7].spend).toEqual(excluded_spend);
        // property
        expect(new_model[2].spend).toEqual(new_model[3].spend);
        expect(new_model[4].spend).toEqual(
          [5, 6, 8, 9, 10, 11, 12].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[13].spend).toEqual(
          [14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        expect(new_model[19].spend).toEqual(
          [20].reduce((acc, index) => acc + new_model[index].spend, 0)
        );
        // agency
        expect(Math.round(new_model[1].spend)).toEqual(
          Math.round([3, 5, 6, 8, 9, 10, 11, 12, 14, 15, 16, 17].reduce((acc, index) => acc + new_model[index].spend, 0))
        );
        expect(Math.round(new_model[18].spend)).toEqual(Math.round(new_model[20].spend));
        // total
        expect(new_model[0].spend).toEqual(100000);
      });

    });

  });


  describe('Filters', () => {

    let parsedModel;

    beforeEach(() => {
      Actions.parseAgencyModel(generateMockRawModel());
      parsedModel = functionToTest().slice(0);
    });

    describe('Create', () => {

      it('agency filter model', () => {
        Actions.createAgencyFilterModel(parsedModel);
        let agencyFilterModel = functionToTest();

        expect(agencyFilterModel.length).toEqual(2);

        expect(agencyFilterModel.map(row => row.name)).toEqual(['Hearts & Science', 'OMD USA']);
        expect(agencyFilterModel.map(row => row.name)).toEqual(['Hearts & Science', 'OMD USA']);

        agencyFilterModel
          .forEach((row, index) => {
            expect(row.type).toEqual(OptionModelTypes.Agency);
            expect(row.key).toEqual('agency_name');
            expect(row.selected).toBeFalsy();
            expect(row.id).toEqual(index);
            expect(row.evaluationStrategy).toEqual(FilterEvaluationStrategies.equal);
          });
      });

      it('property filter model', () => {
        Actions.createPropertyFilterModel(parsedModel);
        let propertyFilterModel = functionToTest();

        expect(propertyFilterModel.length).toEqual(3);

        expect(propertyFilterModel.map(row => row.name)).toEqual(['All Night', 'Bravo', 'CNBC - Business Day']);
        expect(propertyFilterModel.map(row => row.value)).toEqual(['All Night', 'Bravo', 'CNBC - Business Day']);

        propertyFilterModel
          .forEach((row, index) => {
            expect(row.type).toEqual(OptionModelTypes.Property);
            expect(row.key).toEqual('property_name');
            expect(row.selected).toBeFalsy();
            expect(row.id).toEqual(index);
            expect(row.evaluationStrategy).toEqual(FilterEvaluationStrategies.equal);
          });
      });

      it('advertiser filter model', () => {
        Actions.createAdvertiserFilterModel(parsedModel);
        let advertiserFilterModel = functionToTest();

        expect(advertiserFilterModel.length).toEqual(4);

        expect(advertiserFilterModel.map(row => row.name)).toEqual(
          ['AT&T', 'AT&T Entertainment Group', 'J.C. Penney Co.', 'Procter & Gamble']
        );
        expect(advertiserFilterModel.map(row => row.value)).toEqual(
          ['AT&T', 'AT&T Entertainment Group', 'J.C. Penney Co.', 'Procter & Gamble']
        );

        advertiserFilterModel
          .forEach((row, index) => {
            expect(row.type).toEqual(OptionModelTypes.Advertiser);
            expect(row.key).toEqual('advertiser_name');
            expect(row.selected).toBeFalsy();
            expect(row.id).toEqual(index);
            expect(row.evaluationStrategy).toEqual(FilterEvaluationStrategies.equal);
          });
      });

      it('demo filter model', () => {
        Actions.createDemoFilterModel(parsedModel);
        let demoFilterModel = functionToTest();

        expect(demoFilterModel.length).toEqual(5);

        expect(demoFilterModel.map(row => row.name)).toEqual(
          ['F18-49', 'F25-54', 'HNWI', 'P18-49', 'P25-54']
        );
        expect(demoFilterModel.map(row => row.value)).toEqual(
          ['F18-49', 'F25-54', 'HNWI', 'P18-49', 'P25-54']
        );

        demoFilterModel
          .forEach((row, index) => {
            expect(row.type).toEqual(OptionModelTypes.Demo);
            expect(row.key).toEqual('demo');
            expect(row.selected).toBeFalsy();
            expect(row.id).toEqual(index);
            expect(row.evaluationStrategy).toEqual(FilterEvaluationStrategies.equal);
          });
      });

      it('spend variance filter model', () => {
        Actions.createSpendVarianceFilterModel();
        let spendVarianceFilterModel = functionToTest();

        expect(spendVarianceFilterModel.length).toEqual(1);

        expect(spendVarianceFilterModel.map(row => row.name)).toEqual(
          ['Greater Than']
        );
        expect(spendVarianceFilterModel.map(row => row.evaluationStrategy)).toEqual(
          [FilterEvaluationStrategies.greater_than_equal_to_absolute_val]
        );
        expect(spendVarianceFilterModel.map(row => row.type)).toEqual(
          [OptionModelTypes.VarianceFilterValue]
        );

        spendVarianceFilterModel
          .forEach((row, index) => {
            expect(row.key).toEqual('variance');
            expect(row.id).toEqual(index);
            expect(row.selected).toBeFalsy();
          });

      });

    });


    describe('Updating', () => {

      describe('Multi-select Element Based Filters', () => {

        it('calls the model based on the passed argument', () => {
          Actions.updateMultiSelectModel('AgencyFilterModel', []);
          expect(StateManager.update).toHaveBeenCalledWith('AgencyFilterModel');
          Actions.updateMultiSelectModel('DemoFilterModel', []);
          expect(StateManager.update).toHaveBeenCalledWith('DemoFilterModel');
        });

        it('marks the items with the passed IDs as selected', () => {
          let mockFilters = [
            { id: 0, selected: false },
            { id: 1, selected: false },
            { id: 2, selected: false },
            { id: 3, selected: false }
          ];
          Actions.updateMultiSelectModel('AgencyFilterModel', [0, 3]);
          let new_mockFilters = functionToTest(mockFilters);
          expect(new_mockFilters[0].selected).toBeTruthy();
          expect(new_mockFilters[1].selected).toBeFalsy();
          expect(new_mockFilters[2].selected).toBeFalsy();
          expect(new_mockFilters[3].selected).toBeTruthy();
        });

        it('unmarks the items prviously marked as selected', () => {
          let mockFilters = [
            { id: 0, selected: false },
            { id: 1, selected: true },
            { id: 2, selected: false },
            { id: 3, selected: true }
          ];
          Actions.updateMultiSelectModel('AgencyFilterModel', [0, 3]);
          let new_mockFilters = functionToTest(mockFilters);
          expect(new_mockFilters[0].selected).toBeTruthy();
          expect(new_mockFilters[1].selected).toBeFalsy();
          expect(new_mockFilters[2].selected).toBeFalsy();
          expect(new_mockFilters[3].selected).toBeTruthy();
        });

        it('unmakrs all as selected when ID array is empty', () => {
          let mockFilters = [
            { id: 0, selected: true },
            { id: 1, selected: true },
            { id: 2, selected: false },
            { id: 3, selected: true }
          ];
          Actions.updateMultiSelectModel('AgencyFilterModel', []);
          let new_mockFilters = functionToTest(mockFilters);
          expect(new_mockFilters[0].selected).toBeFalsy();
          expect(new_mockFilters[1].selected).toBeFalsy();
          expect(new_mockFilters[2].selected).toBeFalsy();
          expect(new_mockFilters[3].selected).toBeFalsy();
        });

      });


      describe('Spend Variance Filters', () => {

        let mockFilters;

        beforeEach(() => {
          mockFilters = [
            { id: 0, selected: false, value: 0 },
            { id: 1, selected: false, value: 0 }
          ];
        });

        it('sets the item as selected based on the passed arugments', () => {
          Actions.updateVarianceFilter(0, 300678);
          let new_mockFilters = functionToTest(mockFilters);
          expect(new_mockFilters[0].selected).toBeTruthy();
          expect(new_mockFilters[1].selected).toBeFalsy();
        });

        it('sets the value on the matching ID', () => {
          Actions.updateVarianceFilter(0, 300678);
          let new_mockFilters = functionToTest(mockFilters);
          expect(new_mockFilters[0].value).toEqual(300678);
        });

        it('sets the value to 0 and selected to false when null is passed', () => {
          mockFilters[1].value = 1000000;
          mockFilters[1].selected = true;
          Actions.updateVarianceFilter(1, null);
          let new_mockFilters = functionToTest(mockFilters);
          expect(new_mockFilters[1].value).toEqual(0);
          expect(new_mockFilters[1].selected).toBeFalsy();
        });

        it('converts a value from a string to a Number', () => {
          Actions.updateVarianceFilter(1, '250000');
          let new_mockFilters = functionToTest(mockFilters);
          expect(new_mockFilters[1].value).toEqual(250000);
          expect(new_mockFilters[1].selected).toBeTruthy();
        });

      });

    });


    describe('Applying Selected', () => {

      let advertiserFilters, propertyFilters, agencyFilters, demoFilters, varianceFilters;

      beforeEach(() => {

        Actions.createAdvertiserFilterModel(parsedModel);
        advertiserFilters = functionToTest();

        Actions.createPropertyFilterModel(parsedModel);
        propertyFilters = functionToTest();

        Actions.createAgencyFilterModel(parsedModel);
        agencyFilters = functionToTest();

        Actions.createDemoFilterModel(parsedModel);
        demoFilters = functionToTest();

        Actions.createSpendVarianceFilterModel();
        varianceFilters = functionToTest();

      });


      describe('apply a single filter', () => {

        it('hides all properties and advertisers not related to the selected agency', () => {

          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(parsedModel[index].isFiltered).toBeTruthy());

          Actions.filterAgencyModel([agencyFilters[0]]); // Hearts & Science
          let updated_model = functionToTest(parsedModel);

          [0, 18, 19, 20]
            .forEach(index => expect(updated_model[index].isFiltered).toBeFalsy());

          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            .forEach(index => expect(updated_model[index].isFiltered).toBeTruthy());

        });

        it('hides all advertisers, properties, and agencies not related to the selected property', () => {

          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(parsedModel[index].isFiltered).toBeTruthy());

          Actions.filterAgencyModel([propertyFilters[0]]); // All Night
          let updated_model = functionToTest(parsedModel);

          [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            .forEach(index => {
              expect(updated_model[index].isFiltered).toBeFalsy();
            });

          [1, 2, 3, 18, 19, 20]
            .forEach(index => expect(updated_model[index].isFiltered).toBeTruthy());

        });

        it('hides all advertisers, properties, and agencies not related to the selected advertiser', () => {

          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(parsedModel[index].isFiltered).toBeTruthy());

          Actions.filterAgencyModel([advertiserFilters[1]]); // AT&T Entertainment Group
          let updated_model = functionToTest(parsedModel);

          [0, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => {
              expect(updated_model[index].isFiltered).toBeFalsy();
            });

          [1, 4, 5, 6]
            .forEach(index => expect(updated_model[index].isFiltered).toBeTruthy());

        });

        it('hides all the advertisers, properties, and agencies based on the selected demo', () => {

          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(parsedModel[index].isFiltered).toBeTruthy());

          Actions.filterAgencyModel([demoFilters[2]]); // HNWI
          let updated_model = functionToTest(parsedModel);

          [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 19, 20]
            .forEach(index => {
              expect(updated_model[index].isFiltered).toBeFalsy();
            });

          [1, 13, 14, 16, 17]
            .forEach(index => {
              expect(updated_model[index].isFiltered).toBeTruthy();
            });

        });

        xit('hides all the advertisers, properties, and agencies based on the variance filter', () => {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(parsedModel[index].isFiltered).toBeTruthy());

          varianceFilters[0] = Object.assign({}, varianceFilters[0], { value: '-500000' });

          Actions.filterAgencyModel([varianceFilters[0]]); // Procter & Gamble, on Bravo, in Hearts and Sciences
          let updated_model = functionToTest(parsedModel);

          [0, 8]
            .forEach(index => {
              expect(updated_model[index].isFiltered).toBeFalsy();
            });

          [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => {
              expect(updated_model[index].isFiltered).toBeTruthy();
            });
        });

      });


      describe('combine filters', () => {

        it('different filter types should act like ANDs, not ORs', () => {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(parsedModel[index].isFiltered).toBeTruthy());

          Actions.filterAgencyModel([advertiserFilters[3], propertyFilters[0]]); // Proctor and Gamble on Bravo only
          let updated_model = functionToTest(parsedModel);

          [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(updated_model[index].isFiltered).toBeFalsy());

          [1, 2, 3]
            .forEach(index => expect(updated_model[index].isFiltered).toBeTruthy());

        });

        it('same filter types should act like ORs not ANDs', () => {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(parsedModel[index].isFiltered).toBeTruthy());

          // Proctor and Gamble and AT&T on Hearts & Science
          Actions.filterAgencyModel([advertiserFilters[0], advertiserFilters[3], agencyFilters[0]]);
          let updated_model = functionToTest(parsedModel);

          [0, 5, 6, 18, 19, 20]
            .forEach(index => expect(updated_model[index].isFiltered).toBeFalsy());

          [1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            .forEach(index => expect(updated_model[index].isFiltered).toBeTruthy());

        });

        xit('same filter types should act like ORs not ANDs and also work with the variance filter', () => {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            .forEach(index => expect(parsedModel[index].isFiltered).toBeTruthy());

          varianceFilters[0] = Object.assign({}, varianceFilters[0], { value: '-500000' });

          // Proctor and Gamble and AT&T on Hearts & Science
          Actions.filterAgencyModel([advertiserFilters[0], advertiserFilters[3], agencyFilters[0], varianceFilters[0]]);
          let updated_model = functionToTest(parsedModel);

          [0, 5, 6, 8, 18, 19, 20]
            .forEach(index => expect(updated_model[index].isFiltered).toBeFalsy());

          [1, 2, 3, 4, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            .forEach(index => expect(updated_model[index].isFiltered).toBeTruthy());

        });

      });

    });

    it('return immediately if the state is null', () => {
      Actions.filterAgencyModel([]);
      expect(functionToTest(null)).toBeUndefined();
    });

    it('set all rows (except TotalRow) as filtered when filters array is empty', () => {
      parsedModel
        .forEach((row, index) => {
          if (index > 0) {
            parsedModel[index] = Object.assign({}, row, { isFiltered: false });
          }
        });
      Actions.filterAgencyModel([]);
      let new_model = functionToTest(parsedModel);
      new_model
        .forEach((row, index) => {
          if (index > 0) {
            expect(row.isFiltered).toBeTruthy();
          }
        });
    });

  });

});


/** Generate a Mock Rw Data */
function generateMockRawModel() {
  return [{
    'selling_vertical': 'Entertainment',
    'property_name': 'All Night',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'Procter & Gamble',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'F18-49',
    'guaranteed_cpm': 3.52,
    'spend': 330000,
    'registration': 415000,
    'projection': 415000,
    'agency_spend': 330000
  }, {
    'selling_vertical': 'Lifestyle',
    'property_name': 'Bravo',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'AT&T Entertainment Group',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'P18-49',
    'guaranteed_cpm': 15.05,
    'spend': 5650000,
    'registration': 3750000,
    'projection': 3750000,
    'agency_spend': 5650000
  }, {
    'selling_vertical': 'Lifestyle',
    'property_name': 'Bravo',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'AT&T Entertainment Group',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'P18-49',
    'guaranteed_cpm': 0,
    'spend': 0,
    'registration': 3750000,
    'projection': 3750000,
    'agency_spend': 0
  }, {
    'selling_vertical': 'Lifestyle',
    'property_name': 'Bravo',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'Procter & Gamble',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'F18-49',
    'guaranteed_cpm': 35.94,
    'spend': 2039714,
    'registration': 3225000,
    'projection': 3225000,
    'agency_spend': 2039714
  }, {
    'selling_vertical': 'Lifestyle',
    'property_name': 'Bravo',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'Procter & Gamble',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'F18-49',
    'guaranteed_cpm': 30.79,
    'spend': 3508716,
    'registration': 3400000,
    'projection': 3400000,
    'agency_spend': 4385895
  }, {
    'selling_vertical': 'Lifestyle',
    'property_name': 'Bravo',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'Procter & Gamble',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'F18-49',
    'guaranteed_cpm': 22.31,
    'spend': 1793667,
    'registration': 2900000,
    'projection': 2900000,
    'agency_spend': 1793667
  }, {
    'selling_vertical': 'Lifestyle',
    'property_name': 'Bravo',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'Procter & Gamble',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'F18-49',
    'guaranteed_cpm': 19.4,
    'spend': 1866462,
    'registration': 1250000,
    'projection': 1250000,
    'agency_spend': 1866462
  }, {
    'selling_vertical': 'Lifestyle',
    'property_name': 'Bravo',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'Procter & Gamble',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'F25-54',
    'guaranteed_cpm': 39.41,
    'spend': 192789,
    'registration': 0,
    'projection': 0,
    'agency_spend': 385578
  }, {
    'selling_vertical': 'Lifestyle',
    'property_name': 'Bravo',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'Procter & Gamble',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'F18-49',
    'guaranteed_cpm': 39.99,
    'spend': 363975,
    'registration': 0,
    'projection': 0,
    'agency_spend': 291180
  }, {
    'selling_vertical': 'Live News',
    'property_name': 'CNBC - Business Day',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'AT&T',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'HNWI',
    'guaranteed_cpm': 0,
    'spend': 201360,
    'registration': 300000,
    'projection': 300000,
    'agency_spend': 201360
  }, {
    'selling_vertical': 'Live News',
    'property_name': 'CNBC - Business Day',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'AT&T',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'P25-54',
    'guaranteed_cpm': 0,
    'spend': 687500,
    'registration': 650000,
    'projection': 650000,
    'agency_spend': 687500
  }, {
    'selling_vertical': 'Live News',
    'property_name': 'CNBC - Business Day',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'AT&T',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'HNWI',
    'guaranteed_cpm': 0,
    'spend': 0,
    'registration': 650000,
    'projection': 650000,
    'agency_spend': 0
  }, {
    'selling_vertical': 'Live News',
    'property_name': 'CNBC - Business Day',
    'agency_name': 'Hearts & Science',
    'advertiser_name': 'AT&T',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'HNWI',
    'guaranteed_cpm': 0,
    'spend': 0,
    'registration': 1365000,
    'projection': 1365000,
    'agency_spend': 0
  }, {
    'selling_vertical': 'Entertainment',
    'property_name': 'All Night',
    'agency_name': 'OMD USA',
    'advertiser_name': 'J.C. Penney Co.',
    'deal_tag': null,
    'sales_type': null,
    'demo': 'F18-49',
    'guaranteed_cpm': 68.15,
    'spend': 11100000,
    'registration': 12000000,
    'projection': 12000000,
    'agency_spend': 11100000
  }];
}
