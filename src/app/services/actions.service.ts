import { Injectable } from '@angular/core';
import { StateManagerService } from 'sassy-state-manager-ng2';
import { Observable } from 'rxjs';
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
  BaseEntity,
  Comment
} from '../interfaces';
import {
  RowTypes,
  AggregationalColumns,
  OptionModelTypes,
  FilterEvaluationStrategies
} from '../enums/enums';


@Injectable()
export class ActionsService {

  /**
   * Creates an instance of ActionsService.
   *
   * @param {StateManagerService} stateManager
   *
   * @memberOf ActionsService
   */
  constructor(private stateManager: StateManagerService) { }

  /************************************************************
   *
   * PUBLIC METHODS
   *
   ************************************************************/

  /**
   * Sets up the ParentAgencyInfo model
   * @param {object} record
   */
  public setParentAgencyInfo(record: Object) {
    let info = {
      parent_agency_id: record['parent_agency_id'],
      parent_agency_name: record['parent_agency_name']
    };
    this.stateManager.update('ParentAgencyInfo')(state => info);
  }

  /**
   * Sets Up UserProfile Model
   *
   * @param {Object} profile
   *
   * @memberOf ActionsService
   */
  public setUserProfile(profile: Object) {
    this.stateManager.setModel('UserProfile', profile);
  }

  /**
   * Initial Parsing of the model
   *
   * @param {Array<any>} rawModel
   *
   * @memberOf ActionsService
   */
  public parseAgencyModel(rawModel: Array<any>) {
    this.stateManager.update('AgencyModel')((state): Array<TotalRow | Agency | Property | Advertiser> => {

      let new_state = rawModel.slice(0)

        // map raw api dataset to client-side grid
        .map((row, index) => {
          // check to see if the object needs to be mapped
          if (row.hasOwnProperty('guaranteed_cpm') && row.hasOwnProperty('demo')) {
            return row;
          } else {
            // check if there is a agency_deal or not
            let agency_deal_row = row.hasOwnProperty('agency_deal') ? row.agency_deal : {};

            // pull dirty spend_dollar if exist
            let agency_spend = (row.hasOwnProperty('agency_deal') && row.agency_deal.hasOwnProperty('spend_dollars') &&
              row.agency_deal.spend_dollars !== null) ?
              row.agency_deal.spend_dollars :
              row.spend_dollars;

            // Calculate the CMP value: CPM is spend / guaranteed demo imp * 1000

            let guaranteed_cpm = row.guaranteed_impressions ? +((row.spend_dollars / row.guaranteed_impressions) * 1000).toFixed(2) : 0;

            return {
              id: null,
              agency_id: null,
              selling_vertical: row.vertical_name,
              deal_name: row.deal_name,
              property_name: row.property_name,
              agency_name: row.agency_name,
              advertiser_name: row.advertiser_name,
              deal_tag: row.deal_tag_name,
              sales_type: null,
              demo: row.demographic_name,
              spend: row.spend_dollars,
              registration: 0,
              projection: 0,
              variance: 0,
              agency_spend: agency_spend,
              comments: agency_deal_row.hasOwnProperty('comments') ? agency_deal_row.comments : [],
              guaranteed_cpm: guaranteed_cpm,
              property_id: null,
              showChildren: null,
              type: RowTypes.Advertiser,
              collapsed: null,
              isFiltered: null,
              isDirty: false,
              deal_id: row.deal_id
            };
          }
        })

        // create all the 'virtual' rows in the right position
        .reduce((acc, row, index: number) => {
          // local versions of the collection and the row
          let new_rows = acc.rows.slice(0),
            new_row = <Advertiser>Object.assign({}, row),
            new_agency_advertisers: Array<string> = acc.agency_advertisers.slice(0);

          // add a total row at the top
          if (acc.rows.length === 0) {
            let total: TotalRow = {
              advertisers: [],
              agencies: [],
              collapsed: false,
              id: null,
              isFiltered: false,
              projection: 0,
              properties: [],
              registration: 0,
              showChildren: true,
              spend: 0,
              type: RowTypes.Total,
              agency_spend: 0,
              variance: 0
            };
            new_rows = new_rows.concat(total);
          }

          // add Agency row
          if (acc.rows.length === 0 || acc.rows[acc.rows.length - 1]['agency_name'] !== row['agency_name']) {
            let agency: Agency = {
              advertisers: [],
              agency_name: row['agency_name'],
              collapsed: false,
              id: null,
              isFiltered: true,
              projection: 0,
              properties: [],
              registration: 0,
              showChildren: false,
              spend: 0,
              type: RowTypes.Agency,
              agency_spend: 0,
              variance: 0
            };
            new_rows = new_rows.concat(agency);
          }

          // add a Property row
          if (acc.rows.length === 0 || acc.rows[acc.rows.length - 1]['property_name'] !== row['property_name']) {
            let property: Property = {
              advertisers: [],
              agency_id: null,
              collapsed: true,
              id: null,
              isFiltered: true,
              projection: 0,
              property_name: row['property_name'],
              registration: 0,
              showChildren: false,
              spend: 0,
              type: RowTypes.Property,
              agency_spend: 0,
              variance: 0
            };
            new_rows = new_rows.concat(property);
          }

          // add more to the advertiser row
          new_row.type = RowTypes.Advertiser;
          new_row.comments = row['comments'] ? row['comments'] : [];
          new_row.collapsed = true;
          new_row.isFiltered = true;
          new_row.property_id = null;
          new_row.agency_id = null;
          new_row.id = null;
          new_row.showChildren = null;
          new_row.variance = 0;

          // add to the advertiser total tracking array
          new_rows = new_rows.concat(new_row);

          return { rows: new_rows, agency_advertisers: [] };
        }, {
          rows: [],
          agency_advertisers: []
        })

        // use the rows
        .rows

        // give each row an ID so its easy to find, the ID === index in the array
        .map((row, index) => Object.assign(row, { id: index }))

        // easiest way to set this up is to run over the model backwards
        .reverse()

        // give each agency and property row a reference to the advertisers it has
        // give each agency a reference to the properties it has
        .reduce((acc, row: Advertiser | Property | Agency | TotalRow, index, orig_collection) => {
          let { agency_advertiser_ids, property_advertiser_ids, agency_property_ids } = acc,
            prev_row = acc.rows[acc.rows.length - 1] || null,
            new_row = Object.assign({}, row);

          /** Total */
          if (row.type === RowTypes.Total) {
            (<TotalRow>new_row).advertisers = <number[]>orig_collection
              .filter(_row => _row.type === RowTypes.Advertiser)
              .map(_row => _row.id)
              .reverse();

            (<TotalRow>new_row).properties = <number[]>orig_collection
              .filter(_row => _row.type === RowTypes.Property)
              .map(_row => _row.id)
              .reverse();

            (<TotalRow>new_row).agencies = <number[]>orig_collection
              .filter(_row => _row.type === RowTypes.Agency)
              .map(_row => _row.id)
              .reverse();
          }

          /** Property */
          if (row.type === RowTypes.Property) {
            (<Property>new_row).advertisers = <number[]>property_advertiser_ids.reverse();
            property_advertiser_ids = [];
          }

          /** Agency */
          if (row.type === RowTypes.Agency) {
            (<Agency>new_row).advertisers = <number[]>agency_advertiser_ids.reverse();
            (<Agency>new_row).properties = <number[]>agency_property_ids.reverse();
            agency_advertiser_ids = [];
            agency_property_ids = [];
          }

          if (row.type !== RowTypes.Total && row.type === RowTypes.Advertiser) {
            property_advertiser_ids.push(row.id);
            agency_advertiser_ids.push(row.id);
          }

          if (row.type !== RowTypes.Total && row.type === RowTypes.Property) {
            agency_property_ids.push(row.id);
          }

          return { rows: acc.rows.concat(new_row), agency_advertiser_ids, property_advertiser_ids, agency_property_ids };

        }, { rows: [], agency_advertiser_ids: [], property_advertiser_ids: [], agency_property_ids: [] })

        // use the rows
        .rows

        // put the records back into the right display order
        .reverse()

        // give each advertiser row knowledge of its property and agency
        .reduce((acc, row, index, collection) => {
          let rows = acc;

          if (acc.length === 0) {
            rows = collection.slice(0);
          }

          if (row.type === RowTypes.Agency) {
            row.advertisers.forEach((advertiser_id) => (<Advertiser>rows[advertiser_id]).agency_id = row.id);
            row.properties.forEach((property_id) => (<Property>rows[property_id]).agency_id = row.id);
          }

          if (row.type === RowTypes.Property) {
            row.advertisers.forEach((advertiser_id) => (<Advertiser>rows[advertiser_id]).property_id = row.id);
          }

          return rows;
        }, [])

        // freeze every row
        .map(row => Object.freeze(row));


      /** Summarize all the data now that the model is init'd */
      new_state = this.summarizeAllData(
        new_state,
        [
          AggregationalColumns.registration,
          AggregationalColumns.projection,
          AggregationalColumns.agency_spend,
          AggregationalColumns.spend
        ]
      );
      /** Generate the variance values for all the data */
      new_state = this.spendVarianceAllData(new_state);

      // return it back out again
      return Object.freeze(new_state);
    });
  }


  /**
   * Toggle a property to collapse its children
   *
   * @param {number} property_id
   *
   * @memberOf ActionsService
   */
  public toggleProperty(property_id: number): void {
    this.stateManager.update('AgencyModel')(state => {
      let new_collection = state.slice(0),
        collapsed = (<Property>state[property_id]).showChildren;

      // set all thew advertisers to collapsed
      new_collection = this.applyAttributeChange(
        (<Property>state[property_id]).advertisers,
        new_collection,
        'collapsed',
        collapsed
      );

      // set the property's showChildren to opposite
      new_collection[property_id] = Object.freeze(
        <Property>Object.assign(
          {},
          (<Property>new_collection[property_id]),
          {
            showChildren: !(<Property>new_collection[property_id]).showChildren
          }
        )
      );

      return new_collection;
    });
  }


  /**
   * Toggle agency visiblity
   *
   * @param {any} agency_id
   *
   * @memberOf ActionsService
   */
  public toggleAgency(agency_id) {
    this.stateManager.update('AgencyModel')(state => {
      let new_collection = state.slice(0),
        collapsed = (<Agency>state[agency_id]).showChildren;

      // set the property's showChildren to opposite
      if ((<Agency>new_collection[agency_id]).showChildren) {
        new_collection = this.applyAttributeChange(
          [].concat(
            (<Agency>state[agency_id]).advertisers,
            (<Agency>state[agency_id]).properties,
          ),
          new_collection,
          'collapsed',
          collapsed
        );
        new_collection = this.applyAttributeChange(
          (<Agency>state[agency_id]).properties,
          new_collection,
          'showChildren',
          false
        );
      } else {
        new_collection = this.applyAttributeChange(
          (<Agency>state[agency_id]).properties,
          new_collection,
          'collapsed',
          collapsed
        );
      }

      new_collection[agency_id] = Object.freeze(
        <Agency>Object.assign(
          {},
          (<Agency>new_collection[agency_id]),
          {
            showChildren: !(<Agency>new_collection[agency_id]).showChildren
          }
        )
      );

      return new_collection;
    });
  }


  /**
   * Update the advertiser value for the specific attribute passed
   *
   * @param {number} id
   * @param {('registration'|'projection')} attribute
   * @param {number} value
   *
   * @memberOf ActionsService
   */
  public updateAdvertiserValue(id: number, attribute: AggregationalColumns, value: number) {
    this.stateManager.update('AgencyDealsDirty')(state => true);
    this.stateManager.update('AgencyModel')(state => {
      let new_collection = state.slice(0);

      // update the advertiser object
      new_collection[id] = Object.assign({}, new_collection[id],
        { [AggregationalColumns[attribute]]: value, isDirty: true });
      new_collection[id] = Object.freeze(Object.assign(
        {},
        new_collection[id],
        { variance: this.variance((<Advertiser>new_collection[id]).spend, (<Advertiser>new_collection[id]).agency_spend) }
      ));

      // update property
      new_collection = this.sumCollectionByAttribute(
        [(<Advertiser>new_collection[id]).property_id],
        new_collection,
        attribute
      );
      new_collection = this.spendVarianceByCollection(
        [(<Advertiser>new_collection[id]).property_id],
        new_collection
      );

      // update the agency
      new_collection = this.sumCollectionByAttribute(
        [(<Advertiser>new_collection[id]).agency_id],
        new_collection,
        attribute
      );
      new_collection = this.spendVarianceByCollection(
        [(<Advertiser>new_collection[id]).agency_id],
        new_collection
      );

      // update the total
      new_collection = this.sumCollectionByAttribute(
        [0],
        new_collection,
        attribute
      );
      new_collection = this.spendVarianceByCollection(
        [0],
        new_collection
      );

      return Object.freeze(new_collection);
    });
  }


  /**
   * Update the property and then rollup all the changes
   *
   * @param {number} id
   * @param {('registration'|'projection')} attribute
   * @param {number} value
   *
   * @memberOf ActionsService
   */
  public updatePropertyValue(id: number, attribute: AggregationalColumns, value: number) {
    this.stateManager.update('AgencyModel')(state => {
      let new_collection = state.slice(0),
        allZeroes: boolean = (<Property>new_collection[id]).advertisers
          .filter((advertiser_id) => new_collection[advertiser_id].isFiltered)
          .every(advertiser_id => new_collection[advertiser_id][AggregationalColumns[attribute]] === 0);

      // create ratio lookup and apply it
      new_collection = this.applyRatioDollars(new_collection, allZeroes, id, attribute, value);
      // update the variance
      new_collection = this.spendVarianceByCollection(
        (<Property>new_collection[id]).advertisers,
        new_collection
      );


      // normalize property value
      new_collection = this.sumCollectionByAttribute(
        [id],
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        [id],
        new_collection
      );


      // update the agency
      new_collection = this.sumCollectionByAttribute(
        [(<Property>new_collection[id]).agency_id],
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        [(<Property>new_collection[id]).agency_id],
        new_collection
      );


      // update the total
      new_collection = this.sumCollectionByAttribute(
        [0],
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        [0],
        new_collection
      );


      return Object.freeze(new_collection);
    });
  }


  /**
   * Update an agency and roll up the changes
   *
   * @param {number} id
   * @param {('registration'|'projection')} attribute
   * @param {number} value
   *
   * @memberOf ActionsService
   */
  public updateAgencyValue(id: number, attribute: AggregationalColumns, value: number) {
    this.stateManager.update('AgencyModel')(state => {
      let new_collection = state.slice(0),
        allZeroes: boolean = (<Agency>new_collection[id]).advertisers
          .filter((advertiser_id) => new_collection[advertiser_id].isFiltered)
          .every(advertiser_id => new_collection[advertiser_id][AggregationalColumns[attribute]] === 0);

      // create ratio lookup and apply it
      new_collection = this.applyRatioDollars(new_collection, allZeroes, id, attribute, value);
      // update the variance
      new_collection = this.spendVarianceByCollection(
        (<Agency>new_collection[id]).advertisers,
        new_collection
      );


      // normalize property value
      new_collection = this.sumCollectionByAttribute(
        (<Agency>new_collection[id]).properties,
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        (<Agency>new_collection[id]).properties,
        new_collection
      );


      // update the agency
      new_collection = this.sumCollectionByAttribute(
        [id],
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        [id],
        new_collection
      );


      // update the total
      new_collection = this.sumCollectionByAttribute(
        [0],
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        [0],
        new_collection
      );


      return Object.freeze(new_collection);
    });
  }


  /**
   * Update the total value and then roll everything up from the bottom
   *
   * @param {number} id
   * @param {('registration'|'projection')} attribute
   * @param {number} value
   *
   * @memberOf ActionsService
   */
  public updateTotalValue(id: number, attribute: AggregationalColumns, value: number) {
    this.stateManager.update('AgencyModel')(state => {

      let new_collection = state.slice(0),
        allZeroes: boolean = (<TotalRow>new_collection[id]).advertisers
          .filter((advertiser_id) => new_collection[advertiser_id].isFiltered)
          .every(advertiser_id => new_collection[advertiser_id][AggregationalColumns[attribute]] === 0);

      // create ratio lookup and apply it
      new_collection = this.applyRatioDollars(new_collection, allZeroes, id, attribute, value);
      // update the variance
      new_collection = this.spendVarianceByCollection(
        (<TotalRow>new_collection[id]).advertisers,
        new_collection
      );


      // update properties
      new_collection = this.sumCollectionByAttribute(
        (<TotalRow>new_collection[id]).properties,
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        (<TotalRow>new_collection[id]).properties,
        new_collection
      );


      // update agencies
      new_collection = this.sumCollectionByAttribute(
        (<TotalRow>new_collection[id]).agencies,
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        (<TotalRow>new_collection[id]).agencies,
        new_collection
      );


      // update the total
      new_collection = this.sumCollectionByAttribute(
        [0],
        new_collection,
        attribute
      );
      // update the variance
      new_collection = this.spendVarianceByCollection(
        [0],
        new_collection
      );


      return new_collection;
    });
  }


  /**
   *
   *
   * @param {number} id
   * @param {Comment[]} comments
   *
   * @memberOf ActionsService
   */
  public updateCommentValue(id: number, comments: Comment[]) {
    this.stateManager.update('AgencyModel')(state => {
      return state.map(row => {
        if (row.id === id) {
          return Object.assign({}, row, {
            agency_deal : {
              comments: comments
            },
            comments: comments
          });
        }
        return row;
      });
    });
  }


  /**
   *
   *
   * @param {Comment[]} comments
   *
   * @memberOf ActionsService
   */
  updateComments(comments: Comment[], id: number, dealId: number) {
    this.stateManager.update('CommentsModel')((state) : any => {
        return {
          id: id,
          deal_id: dealId,
          comments: comments
        };
    });
  }


  /**
   * Recalculate all the values
   *
   *
   * @memberOf ActionsService
   */
  public recalculateEntireModel() {
    this.stateManager.update('AgencyModel')(state => {
      let new_collection = state.slice(0);

      new_collection = this.summarizeAllData(
        state,
        [
          AggregationalColumns.registration,
          AggregationalColumns.projection,
          AggregationalColumns.agency_spend,
          AggregationalColumns.spend
        ]
      );
      new_collection = this.spendVarianceAllData(new_collection);

      return new_collection;
    });
  }


  /**
   * Create the Agency Filter Model
   *
   * @param {any} AgencyModel
   *
   * @memberOf ActionsService
   */
  public createAgencyFilterModel(AgencyModel: Agency[]) {
    this.stateManager.update('AgencyFilterModel')(() => {
      return AgencyModel
        .filter(row => row.type === RowTypes.Agency)
        .map((row: Agency) => {
          return Object.freeze(<OptionModel>{
            type: OptionModelTypes.Agency,
            name: row.agency_name,
            key: 'agency_name',
            value: row.agency_name,
            selected: false,
            id: null,
            evaluationStrategy: FilterEvaluationStrategies.equal
          });
        })
        .sort(this.sortObjectNamesByAttribute('value'))
        .map((_filter, id) => Object.freeze(Object.assign({}, _filter, { id })));
    });
  }


  /**
   * Create the Property Filter Model
   *
   * @param {Property[]} AgencyModel
   *
   * @memberOf ActionsService
   */
  public createPropertyFilterModel(AgencyModel: Property[]) {
    this.stateManager.update('PropertyFilterModel')(() => {
      return AgencyModel
        .filter(row => row.type === RowTypes.Property)
        .reduce((acc, row: Property) => {
          if (acc.some((_filter: OptionModel) => _filter.value === row.property_name)) {
            return acc;
          }
          return acc.concat(Object.freeze(<OptionModel>{
            type: OptionModelTypes.Property,
            name: row.property_name,
            key: 'property_name',
            value: row.property_name,
            selected: false,
            id: null,
            evaluationStrategy: FilterEvaluationStrategies.equal
          }));
        }, [])
        .sort(this.sortObjectNamesByAttribute('value'))
        .map((_filter, id) => Object.freeze(Object.assign({}, _filter, { id })));
    });
  }


  /**
   * Create the Advertiser Model
   *
   * @param {Advertiser[]} AgencyModel
   *
   * @memberOf ActionsService
   */
  public createAdvertiserFilterModel(AgencyModel: Advertiser[]) {
    this.stateManager.update('AdvertiserFilterModel')(() => {
      return AgencyModel
        .filter(row => row.type === RowTypes.Advertiser)
        .reduce((acc, row: Advertiser) => {
          if (acc.some((_filter: OptionModel) => _filter.value === row.advertiser_name)) {
            return acc;
          }
          return acc.concat(<OptionModel>{
            type: OptionModelTypes.Advertiser,
            name: row.advertiser_name,
            key: 'advertiser_name',
            value: row.advertiser_name,
            selected: false,
            id: null,
            evaluationStrategy: FilterEvaluationStrategies.equal
          });
        }, [])
        .sort(this.sortObjectNamesByAttribute('value'))
        .map((_filter, id) => Object.freeze(Object.assign({}, _filter, { id })));
    });
  }


  /**
   * Create the Filter model for demo
   *
   * @param {Advertiser[]} AgencyModel
   *
   * @memberOf ActionsService
   */
  public createDemoFilterModel(AgencyModel: Advertiser[]) {
    this.stateManager.update('DemoFilterModel')(state => {
      return AgencyModel
        .filter(row => row.type === RowTypes.Advertiser)
        .reduce((acc, row: Advertiser) => {
          if (acc.some((_filter: OptionModel) => _filter.value === row.demo)) {
            return acc;
          }
          return acc.concat(<OptionModel>{
            type: OptionModelTypes.Demo,
            name: row.demo,
            key: 'demo',
            value: row.demo,
            selected: false,
            id: null,
            evaluationStrategy: FilterEvaluationStrategies.equal
          });
        }, [])
        .sort(this.sortObjectNamesByAttribute('value'))
        .map((_filter, id) => Object.freeze(Object.assign({}, _filter, { id })));
    });
  }


  /**
   * Create the filter to holdthe variance spend filtering
   * This filter model works a little different than the others,
   * but, it doesn't create an exception to the filter evaluation functionality
   *
   *
   * @memberOf ActionsService
   */
  public createSpendVarianceFilterModel() {
    this.stateManager.update('SpendVarianceFilterModel')(state => {
      let filters: OptionModel[] = [];

      filters.push(Object.freeze({
        type: OptionModelTypes.VarianceFilterValue,
        name: 'Greater Than',
        key: 'variance',
        value: 0,
        selected: false,
        id: 0,
        evaluationStrategy: FilterEvaluationStrategies.greater_than_equal_to_absolute_val
      }));

      return filters;
    });
  }


  /**
   * Update a Filter Model with the currently selected items
   *
   * @param {'AgencyFilterModel'} modelName
   * @param {number[]} ids
   *
   * @memberOf ActionsService
   */
  public updateMultiSelectModel(
    modelName: 'AgencyFilterModel' | 'PropertyFilterModel' | 'AdvertiserFilterModel' | 'DemoFilterModel',
    ids: number[]
  ) {
    this.stateManager.update(modelName)((state: OptionModel[]) => {

      let currentlySelectedIds = state.filter(option => option.selected).map(option => option.id),
        new_collection = state.slice(0);

      // deselect the following
      currentlySelectedIds
        .filter(id => ids.indexOf(id) < 0)
        .forEach((id) => {
          new_collection[id] = Object.freeze(Object.assign({}, new_collection[id], { selected: false }));
        });

      // select the following
      ids
        .filter(id => currentlySelectedIds.indexOf(id) < 0)
        .forEach((id) => {
          new_collection[id] = Object.freeze(Object.assign({}, new_collection[id], { selected: true }));
        });

      return Object.freeze(new_collection);
    });
  }


  /**
   * Update the spend variance filter with special logic
   *
   * @param {number} filterId
   * @param {(number|)} [value=null]
   *
   * @memberOf ActionsService
   */
  public updateVarianceFilter(
    filterId: number,
    value: string | null
  ) {
    this.stateManager.update('SpendVarianceFilterModel')((state: OptionModel[]) => {
      return state.slice(0)
        .map((filter) => {

          // if its our filter, lets update it
          if (filter.id === filterId) {
            if (value === null) {
              return Object.freeze(Object.assign({}, filter, {
                selected: false,
                value: 0
              }));
            } else {
              return Object.freeze(Object.assign({}, filter, {
                selected: true,
                value: Number(value)
              }));
            }
          }

          // otherwise return it
          return filter;
        });

    });
  }


  /**
   * Update the Agency Model with what is filtered
   *
   * @param {OptionModel[]} filters
   *
   * @memberOf ActionsService
   */
  public filterAgencyModel(filters: OptionModel[], modelName = 'AgencyModel') {
    this.stateManager.update(modelName)((state) => {

      // if state is null, don't bother
      if (state === null) {
        return;
      }

      // reset when no filters are selected
      if (filters.length === 0) {
        return state.slice(0)
          .map(row => {
            if ((<TotalRow>row).type !== RowTypes.Total) {
              return Object.freeze(Object.assign({}, row, { isFiltered: true }));
            }
            return row;
          });
      }


      // build this fake option model to use for checking if isFiltered is applied
      let isAdvertiserFilteredOption: OptionModel = {
        id: null,
        name: 'isFilteredOption',
        key: 'isFiltered',
        value: true,
        selected: true,
        type: OptionModelTypes.Advertiser,
        evaluationStrategy: FilterEvaluationStrategies.equal
      },
        isPropertyFilteredOption: OptionModel = {
          id: null,
          name: 'isFilteredOption',
          key: 'isFiltered',
          value: true,
          selected: true,
          type: OptionModelTypes.Property,
          evaluationStrategy: FilterEvaluationStrategies.equal
        };


      // construct the filter groups
      let filterGroups = groupFilters(filters);


      // filter the advertiser first
      let new_state = state.slice(0)
        .map((row: Advertiser) => {
          if (row.type === RowTypes.Advertiser) {
            return Object.freeze(Object.assign({}, row, { isFiltered: checkFilters(filterGroups)(row) }));
          }
          return row;
        })
        .map((row: Property, index, orig_collection) => {
          if (row.type === RowTypes.Property) {
            let agencies: Advertiser[] = row.advertisers.map(advertiser_id => orig_collection[advertiser_id]),
              checkFiltersFunc = checkFilters(groupFilters([isAdvertiserFilteredOption]));
            return Object.freeze(Object.assign({}, row, { isFiltered: agencies.some(checkFiltersFunc) }));
          }
          return row;
        })
        .map((row: Agency, index, orig_collection) => {
          if (row.type === RowTypes.Agency) {
            let properties: Property[] = row.properties.map(property_id => orig_collection[property_id]),
              checkFiltersFunc = checkFilters(groupFilters([isPropertyFilteredOption]));
            return Object.freeze(Object.assign({}, row, { isFiltered: properties.some(checkFiltersFunc) }));
          }
          return row;
        });

      return Object.freeze(new_state);


      /**
       * Check the filters against a row
       *
       * @param {(Advertiser|Property|Agency)} _row
       * @param {OptionModel[]} _filters
       * @returns {boolean}
       */
      function checkFilters(_filters: { [key: string]: OptionModel[] }): (_row: Advertiser | Property | Agency) => boolean {
        let typeKeys = Object.keys(_filters);
        return (_row: Advertiser | Property | Agency): boolean => {
          return typeKeys
            .every(typeKey => _filters[typeKey]
              .some(filter => applyEvaluationStrategy(_row[filter.key], filter.value, filter.evaluationStrategy)));
        };
      }


      /**
       * Build a Map to look group the same filters so they act as a OR
       *
       * @param {OptionModel[]} _filters
       * @returns
       */
      function groupFilters(_filters: OptionModel[]) {
        return _filters
          .reduce((groups, filter) => {
            // if it doesn't exist
            if (!groups[filter.type]) {
              groups[filter.type] = [];
            }
            // push it on to the group type
            groups[filter.type].push(filter);

            return groups;
          }, {});
      }


      /**
       * Applies the evaluation strategy defined on the filter object
       *
       * @param {any} value_a
       * @param {any} value_b
       * @param {FilterEvaluationStrategies} evaluationStrategy
       * @returns
       */
      function applyEvaluationStrategy(value_a, value_b, evaluationStrategy: FilterEvaluationStrategies) {
        switch (evaluationStrategy) {
          case FilterEvaluationStrategies.equal:
            return value_a === value_b;
          case FilterEvaluationStrategies.greater_than:
            return value_a > value_b;
          case FilterEvaluationStrategies.less_than:
            return value_a < value_b;
          case FilterEvaluationStrategies.greater_than_equal_to:
            return value_a >= value_b;
          case FilterEvaluationStrategies.less_than_equal_to:
            return value_a <= value_b;
          case FilterEvaluationStrategies.greater_than_equal_to_absolute_val:
            return Math.abs(value_a) >= value_b;
        }
      }

    });
  }




  /****************************************************************************************
   * DASHBOARD Specific Actions
   ****************************************************************************************/


  /**
   * Aggregates the Vertical Totals
   *
   * this actions does not update the model, just aggregates it
   *
   * TODO: Possibly move to the TotalRow inteface, and change the Interface to be Totals
   *
   * @param {Advertiser[]} AgencyModel
   * @returns {{broadcast: number, hispanic: number, cable: number, news: number, sports: number, total: number}}
   *
   * @memberOf ActionsService
   */
  public aggregateVerticals(
    AgencyModel: Advertiser | TotalRow[]
  ): { broadcast: number, hispanic: number, cable: number, news: number, sports: number, total: number } {
    return (<TotalRow>AgencyModel[0]).advertisers
      .reduce((aggregate, row_id) => {
        let new_aggregate = Object.assign({}, aggregate),
          row: Advertiser = AgencyModel[row_id];

        if (row.isFiltered) {
          switch (row.selling_vertical) {
            case 'Entertainment':
              new_aggregate.broadcast += row.spend;
              break;
            case 'Hispanic':
              new_aggregate.hispanic += row.spend;
              break;
            case 'Lifestyle':
              new_aggregate.cable += row.spend;
              break;
            case 'Live News':
              new_aggregate.news += row.spend;
              break;
            case 'Live Sports':
              new_aggregate.sports += row.spend;
              break;
          }

          new_aggregate.total += row.spend;
        }

        return new_aggregate;

      }, { broadcast: 0, hispanic: 0, cable: 0, news: 0, sports: 0, total: 0 });
  }


  /**
   * Aggregate the property registration values by highest to lowest
   *
   * @param {(Property|TotalRow[])} AgencyModel
   * @returns {Array<{name: string, value: number}>}
   *
   * @memberOf ActionsService
   */
  public aggregateProperties(AgencyModel: Property | TotalRow[]): Array<{ name: string, value: number }> {
    let property_map = (<TotalRow>AgencyModel[0]).properties
      .reduce((properties, property_id) => {
        let new_properties = Object.assign({}, properties),
          property: Property = AgencyModel[property_id];

        if (!new_properties[property.property_name]) {
          new_properties[property.property_name] = {
            name: property.property_name,
            value: 0
          };
        }
        new_properties[property.property_name].value += property.registration;

        return new_properties;
      }, {});

    return Object.keys(property_map)
      .map((key: string): { name: string, value: number } => property_map[key])
      .sort(this.sortObjectValuesByAttribute('value'));
  }


  /**
   * Aggregate the agency spend dollars by highest to lowest
   *
   * @param {(Agency|TotalRow[])} AgencyModel
   * @returns {Array<{name: string, value: number}>}
   *
   * @memberOf ActionsService
   */
  public aggregateAgencies(AgencyModel: Agency | TotalRow[]): Array<{ name: string, value: number }> {

    let agency_map = (<TotalRow>AgencyModel[0]).agencies
      .reduce((agencies, agency_id) => {
        let new_agencies = Object.assign({}, agencies),
          agency: Agency = AgencyModel[agency_id];

        if (!new_agencies[agency.agency_name]) {
          new_agencies[agency.agency_name] = {
            name: agency.agency_name,
            value: 0
          };
        }
        new_agencies[agency.agency_name].value += agency.spend;

        return new_agencies;
      }, {});

    return Object.keys(agency_map)
      .map((key: string): { name: string, value: number } => agency_map[key])
      .sort(this.sortObjectValuesByAttribute('value'));
  }


  /**
   * Parse the dashboard model
   *
   * @param {(Array<Agency|Advertiser>)} AgencyModel
   *
   * @memberOf ActionsService
   */
  public parseModelDashboard(AgencyModel: Array<Agency | Advertiser>) {
    this.stateManager.update('DashboardAgencyModel')(() => {
      return AgencyModel.slice(1) // skip the total row
        .reduce((acc, row: Agency) => {

          // total row
          if (acc.length === 0) {
            let total: DashboardTotal = {
              dashboard_advertisers: [],
              collapsed: false,
              dashboard_agencies: [],
              id: null,
              isFiltered: false,
              projection: 0,
              registration: 0,
              showChildren: true,
              spend: 0,
              total_ref: 0,
              type: RowTypes.Total,
              agency_spend: 0,
              variance: 0
            };
            acc.push(total);
          }

          // agency row
          if (row.type === RowTypes.Agency) {

            // add agency and clean it up
            let agency: DashboardAgency = {
              agency_name: row.agency_name,
              agency_ref: row.id,
              collapsed: false,
              dashboard_advertisers: [],
              id: null,
              isFiltered: true,
              projection: 0,
              registration: 0,
              showChildren: false,
              spend: 0,
              type: RowTypes.Agency,
              advertisers_ref: [],
              agency_spend: 0,
              variance: 0
            };
            acc.push(agency);

            // generate all the advertisers
            let advertiser_map = row.advertisers
              .reduce((advertiser_ids, advertsier_id) => {
                let new_advertiser_ids = Object.assign({}, advertiser_ids);
                if (!new_advertiser_ids[(<Advertiser>AgencyModel[advertsier_id]).advertiser_name]) {
                  new_advertiser_ids[(<Advertiser>AgencyModel[advertsier_id]).advertiser_name] = [];
                }
                new_advertiser_ids[(<Advertiser>AgencyModel[advertsier_id]).advertiser_name].push(advertsier_id);

                return new_advertiser_ids;
              }, {});

            // loop over the map of advertisers (key) and their IDs (Array<number>)
            // return a sorted array of advertisers, no dupes
            let advertisers = Object.keys(advertiser_map)
              .map((advertiser_name) => {
                let ids = advertiser_map[advertiser_name];
                let advertiser: DashboardAdvertiser = {
                  advertiser_name,
                  advertisers_ref: ids.slice(0),
                  agency_id: null,
                  collapsed: true,
                  id: null,
                  isFiltered: true,
                  projection: 0,
                  registration: 0,
                  showChildren: false,
                  spend: 0,
                  type: RowTypes.Advertiser,
                  agency_spend: 0,
                  variance: 0
                };
                return advertiser;
              })
              .sort(this.sortObjectNamesByAttribute('advertiser_name'));

            // add them to the model
            acc = acc.concat(advertisers);
          }

          return acc;
        }, [])

        // give them all IDs
        .map((row, index) => Object.assign(row, { id: index }))

        // make the model backwards
        .reverse()

        // go over them backwards to build references
        .reduce((acc, row) => {
          let new_row = Object.assign({}, row),
            rows = acc.rows.slice(0),
            agency_advertiser_ids = acc.agency_advertiser_ids.slice(0),
            original_advertiser_ids = acc.original_advertiser_ids.slice(0);

          if ((<DashboardAgency>row).type === RowTypes.Agency) {

            // add the colleciton of advertiser ids to the agency
            (<DashboardAgency>new_row).dashboard_advertisers = agency_advertiser_ids.slice(0).reverse();
            (<DashboardAgency>new_row).advertisers_ref = original_advertiser_ids.slice(0).reverse();

            // zero out the collection of advertiser IDs we're tracking
            agency_advertiser_ids = [];
            original_advertiser_ids = [];
          }

          // add to on going list of advertiser IDs
          if ((<DashboardAdvertiser>row).type === RowTypes.Advertiser) {
            agency_advertiser_ids.push((<DashboardAdvertiser>row).id);
            original_advertiser_ids = original_advertiser_ids.concat((<DashboardAdvertiser>row).advertisers_ref);
          }

          // add the row to the collection
          rows.push(new_row);

          return { rows, agency_advertiser_ids, original_advertiser_ids };
        }, { rows: [], agency_advertiser_ids: [], original_advertiser_ids: [] })
        .rows

        // reverse back into the correct direction
        .reverse()

        // add the agency refs to the
        .reduce((acc, row, index, orig_collection) => {
          let rows = acc.slice(0);

          // if the collection is empty
          if (rows.length === 0) {
            rows = orig_collection.slice(0);
          }

          // add all the advertiser IDs to the total
          // add all the agency IDs to the total
          if ((<DashboardTotal>row).type === RowTypes.Total) {

            (<DashboardTotal>row).dashboard_advertisers = orig_collection
              .filter(_row => _row.type === RowTypes.Advertiser)
              .map(_row => _row.id);

            (<DashboardTotal>row).dashboard_agencies = orig_collection
              .filter((_row: DashboardAgency) => _row.type === RowTypes.Agency)
              .map(_row => _row.id);

          }

          // add agency ID to advertiser
          if ((<DashboardAgency>row).type === RowTypes.Agency) {
            (<DashboardAgency>row).dashboard_advertisers
              .forEach((advertiser_id) => {
                rows[advertiser_id] = Object.assign({}, rows[advertiser_id], { agency_id: (<DashboardAgency>row).id });
              });
          }

          return rows;
        }, [])

        // do the calculations
        .map(this.calculateDashboardModel(AgencyModel));

    });

  }


  /**
   * Sync the dashboard model with the agency model
   *
   * @param {any} AgencyModel
   *
   * @memberOf ActionsService
   */
  public syncDashboardModel(AgencyModel) {
    this.stateManager.update('DashboardAgencyModel')(state => {
      return state.slice(0)
        .map(this.calculateDashboardModel(AgencyModel))
        .map(this.determineFilteredBasedOnValue(AggregationalColumns.spend));
    });
  }


  /**
   * Collapse/Toggle for dashbord model
   *
   * @param {any} agency_id
   *
   * @memberOf ActionsService
   */
  public toggleAgencyForDashboard(agency_id) {
    this.stateManager.update('DashboardAgencyModel')(state => {
      let new_collection = state.slice(0),
        collapsed = (<DashboardAgency>state[agency_id]).showChildren;

      // set the property's showChildren to opposite
      if (collapsed) {
        new_collection = this.applyAttributeChange(
          [].concat(
            (<DashboardAgency>state[agency_id]).dashboard_advertisers
          ),
          new_collection,
          'collapsed',
          collapsed
        );
      } else {
        new_collection = this.applyAttributeChange(
          (<DashboardAgency>state[agency_id]).dashboard_advertisers,
          new_collection,
          'collapsed',
          collapsed
        );
      }

      new_collection[agency_id] = Object.freeze(
        <DashboardAgency>Object.assign(
          {},
          (<DashboardAgency>new_collection[agency_id]),
          { showChildren: !(<DashboardAgency>new_collection[agency_id]).showChildren }
        )
      );

      return new_collection;
    });
  }


  /**
   *
   *
   * @returns
   *
   * @memberOf ActionsService
   */
  public getDirtyAgencyFields() {
    return this.stateManager
      .getModel('AgencyModel')
      .filter(model => model !== null)
      .switchMap(data => {
        return new Observable(observer => {
          observer.next(
            data
              .filter(obj => obj.hasOwnProperty('isDirty') && obj.isDirty === true)
              .map(obj => ({
                deal_id: obj.deal_id,
                spend_dollars: obj.agency_spend
              }))
          );
        });
      })
      .take(1);
  }


  /**
   *
   *
   * @memberOf ActionsService
   */
  public resetDirtyAgencyFields() {
    this.stateManager.update('AgencyModel')(state => {
      return state.map(obj => {
        let objDirtyReset = Object.assign({}, obj, { isDirty: false });
        return objDirtyReset;
      });
    });
  }




  /************************************************************
   *
   * PRIVATE METHODS
   *
   ************************************************************/





  /**
   * Sets the 'collapsed' or 'showChildren' property for a group of rows by ID
   *
   * @private
   * @param {Array<number>} ids
   * @param {(Array<Property | Advertiser>)} collection
   * @param {('collapsed'|'showChildren')} attribute
   * @param {boolean} value
   * @returns {(Array<Advertiser | Property>)}
   *
   * @memberOf ActionsService
   */
  private applyAttributeChange(
    ids: Array<number>,
    collection: Array<Property | Advertiser>,
    attribute: 'collapsed' | 'showChildren',
    value: boolean
  ): Array<Advertiser | Property> {
    let new_collection = collection.slice(0);

    ids
      .forEach((id: number) => {
        new_collection[id] = Object.freeze(<Advertiser | Property>Object.assign(
          {},
          (<Advertiser | Property>new_collection[id]),
          { [attribute]: value }
        ));
      });

    return new_collection;
  }


  /**
   * Sum by attribute for properties or agency
   *
   * @private
   * @param {number} id
   * @param {(Array<TotalRow|Agency|Property|Advertiser>)} collection
   * @param {string} attribute
   * @returns {number}
   *
   * @memberOf ActionsService
   */
  private sumByAttribute(
    id: number,
    collection: Array<TotalRow | Agency | Property | Advertiser>,
    attribute: AggregationalColumns
  ): number {
    return (<Agency | Property>collection[id]).advertisers
      .reduce((acc: number, advertiser_id: number) => {
        if (!collection[advertiser_id].isFiltered) {
          return acc;
        }
        return acc + collection[advertiser_id][AggregationalColumns[attribute]];
      }, 0);
  }


  /**
   * Sum the collection of IDs by attribute
   *
   * @private
   * @param {number[]} ids
   * @param {(Array<TotalRow|Agency|Property|Advertiser>)} collection
   * @param {string} attribute
   * @returns
   *
   * @memberOf ActionsService
   */
  private sumCollectionByAttribute(
    ids: number[],
    collection: Array<TotalRow | Agency | Property | Advertiser>,
    attribute: AggregationalColumns
  ) {
    let new_collection = collection.slice(0);

    ids
      .forEach((id: number) => {
        let new_row = Object.assign({}, new_collection[id]);
        new_row[AggregationalColumns[attribute]] = this.sumByAttribute(id, new_collection, attribute);
        new_collection[id] = Object.freeze(new_row);
      });

    return Object.freeze(new_collection);
  }


  /**
   * Summarize all the data
   *
   * @private
   * @param {any} collection
   * @returns
   *
   * @memberOf ActionsService
   */
  private summarizeAllData(collection, attributesToSummarize: Array<AggregationalColumns>) {
    let properties = collection.filter(row => row.type === RowTypes.Property).map(row => row.id),
      agencies = collection.filter(row => row.type === RowTypes.Agency).map(row => row.id);
    return attributesToSummarize
      .reduce((rows, attribute) => {
        let _rows = rows.slice(0);
        _rows = this.sumCollectionByAttribute(properties, _rows, attribute);
        _rows = this.sumCollectionByAttribute(agencies, _rows, attribute);
        _rows = this.sumCollectionByAttribute([0], _rows, attribute);
        return _rows;
      }, collection.slice(0));
  }


  /**
   * Updated the variance value for all the items in the collection
   *
   * @private
   * @param {any} collection
   * @returns
   *
   * @memberOf ActionsService
   */
  private spendVarianceAllData(collection) {
    let ids = [].concat(
      0,
      <TotalRow>collection[0].advertisers,
      <TotalRow>collection[0].agencies,
      <TotalRow>collection[0].properties
    );
    return this.spendVarianceByCollection(ids, collection);
  }


  /**
   * Apply the ratio dollar calculations
   *
   * @private
   * @param {Array<Object>} collection
   * @param {boolean} allZeroes
   * @param {number} id
   * @param {('registration'|'projection')} attribute
   * @param {number} value
   * @returns {(Array<TotalRow|Agency|Property>)}
   *
   * @memberOf ActionsService
   */
  private applyRatioDollars(
    collection: Array<Object>,
    allZeroes: boolean,
    id: number,
    attribute: AggregationalColumns,
    value: number
  ): Array<TotalRow | Agency | Property> {
    let new_collection = collection.slice(0);

    (<TotalRow | Agency | Property>collection[id]).advertisers

      // reduce down to the non-filtered advertisers
      .reduce((advertisers, advertiser_id) => {
        if ((<TotalRow | Agency | Property>new_collection[advertiser_id]).isFiltered) {
          return advertisers.concat(advertiser_id);
        }
        return advertisers;
      }, [])

      // go over the non-filtered advertiser IDs and return an object with an ID and a ratio
      .map((advertiser_id, index) => {
        let ratio = ((collection[advertiser_id])[AggregationalColumns[attribute]] / (collection[id])[AggregationalColumns[attribute]]);
        if (allZeroes) {
          ratio = 1 / (<TotalRow | Agency | Property>collection[id]).advertisers
            .filter((_advertiser_id) => {
              return (<Advertiser>collection[_advertiser_id]).isFiltered;
            })
            .length;
        }
        return { advertiser_id, ratio };
      })

      // apply each ratio to each advertiser
      .forEach((advertiser_ref) => {
        let new_value = value * advertiser_ref.ratio;
        new_collection[advertiser_ref.advertiser_id] = Object.freeze(Object.assign(
          {}, new_collection[advertiser_ref.advertiser_id], { [AggregationalColumns[attribute]]: new_value }
        ));
      });

    return <Array<TotalRow | Agency | Property>>new_collection;
  }


  /**
   * Sort method for a string attribute on an object
   *
   * @private
   * @param {any} a
   * @param {any} b
   * @returns {number}
   *
   * @memberOf ActionsService
   */
  private sortObjectNamesByAttribute(attr: string): (a, b) => number {
    return (a, b): number => {
      if (a[attr].toUpperCase() < b[attr].toUpperCase()) { return -1; };
      if (a[attr].toUpperCase() > b[attr].toUpperCase()) { return 1; }
      return 0;
    };
  }


  /**
   *  Sort method for a number attribute on an object
   *
   * @private
   * @param {string} attr
   * @returns {(a, b) => number}
   *
   * @memberOf ActionsService
   */
  private sortObjectValuesByAttribute(attr: string): (a, b) => number {
    return (a, b): number => {
      if (a[attr] > b[attr]) { return -1; };
      if (a[attr] < b[attr]) { return 1; }
      return 0;
    };
  }


  /**
   * Determine the isFiltered flag based on value
   * Used for the Dashboard Model syncing
   *
   * @private
   * @param {('registration'|'projection'|'spend')} attribute
   * @returns
   *
   * @memberOf ActionsService
   */
  private determineFilteredBasedOnValue(
    attribute: AggregationalColumns
  ) {
    return (orig_row, index, collection) => {
      let row = Object.assign({}, orig_row);

      if ((<DashboardAgency>row).type === RowTypes.Agency) {
        (<DashboardAgency>row).isFiltered = (<DashboardAgency>row)[AggregationalColumns[attribute]] !== 0;
      }

      if ((<DashboardAdvertiser>row).type === RowTypes.Advertiser) {
        (<DashboardAdvertiser>row).isFiltered = (<DashboardAdvertiser>row)[AggregationalColumns[attribute]] !== 0;
      }
      return row;
    };
  }


  /**
   * Calculate the dashboard model from the agency model
   *
   * @private
   * @param {(Array<TotalRow|Agency|Property|Advertiser>)} AgencyModel
   * @returns {((orig_row, index, collection) => Array<DashboardTotal|DashboardAgency|DashboardAdvertiser>)}
   *
   * @memberOf ActionsService
   */
  private calculateDashboardModel(
    AgencyModel: Array<TotalRow | Agency | Property | Advertiser>
  ): (orig_row, index, collection) => Array<DashboardTotal | DashboardAgency | DashboardAdvertiser> {
    return (orig_row, index, collection) => {
      let row = Object.assign({}, orig_row);

      /** Total */
      if ((<DashboardTotal>row).type === RowTypes.Total) {
        // get it from the source total
        (<DashboardTotal>row).spend = AgencyModel[(<DashboardTotal>row).total_ref].spend;
      }

      /** Agency */
      if ((<DashboardAgency>row).type === RowTypes.Agency) {
        // get it from the source agency
        (<DashboardAgency>row).spend = AgencyModel[(<DashboardAgency>row).agency_ref].spend;
      }

      /** Advertiser */
      // needs its own calculation since its by advertiser
      if ((<DashboardAdvertiser>row).type === RowTypes.Advertiser) {
        row.spend = (<DashboardAdvertiser>row).advertisers_ref
          .reduce((sum, id) => {
            let advertiser = (<Advertiser>AgencyModel[id]);
            if (!advertiser.isFiltered) {
              return sum;
            }
            return sum + advertiser.spend;
          }, 0);
      }

      return row;
    };
  }


  /**
   * Return the difference between two numbers
   *
   * @private
   * @param {number} value_a
   * @param {number} value_b
   * @returns {number}
   *
   * @memberOf ActionsService
   */
  private variance(nbcu_spend: number, agency_spend: number): number {
    return agency_spend - nbcu_spend;
  }


  /**
   * Calculate the spend variance for the given IDs
   *
   * @private
   * @param {number[]} ids
   * @param {(Array<TotalRow|Agency|Property|Advertiser>)} collection
   * @returns
   *
   * @memberOf ActionsService
   */
  private spendVarianceByCollection(
    ids: number[],
    collection: Array<TotalRow | Agency | Property | Advertiser>
  ) {
    let new_collection = collection.slice(0);

    ids
      .forEach((id: number) => {
        let new_row = Object.assign({}, new_collection[id]);
        new_row[AggregationalColumns[AggregationalColumns.variance]] = this.variance(new_row.spend, new_row.agency_spend);
        new_collection[id] = Object.freeze(new_row);
      });

    return Object.freeze(new_collection);
  }

}
