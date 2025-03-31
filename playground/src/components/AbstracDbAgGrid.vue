<script setup lang="ts" generic="M extends Model">
import type { Model, Relation, Repository } from "abstracdb";
import { computed } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef } from "ag-grid-community";

const props = defineProps<{
  repository: Repository<M>;
  with?: string[];
}>();

function getFieldColumn(field: string): ColDef {
  return {
    field,
    flex: 1,
    editable: true,
    headerClass: "adb-ag-field-head",
    cellClass: "adb-ag-field-cell",
  };
}
function getRelationColumn(
  field: string,
  relations: Record<string, Relation>
): ColDef {
  const values = props.repository.database
    .query(relations[field].related)
    .get();

  return {
    field,
    flex: 1,
    editable: true,
    headerClass: "adb-ag-relation-head",
    cellClass: "adb-ag-relation-cell",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      console.error(params);
      return {
        values: values.map((v) => v),
      };
    },
    cellRenderer: (params) => params.value.$primary(),
  };
}

const columns = computed<ColDef[]>(() => {
  const first = props.repository.query().getFirst();
  if (!first) return [];
  const relations = props.repository.use.relations();
  return [
    ...Object.keys(first).map(getFieldColumn),
    ...(props.with || []).map((key) => getRelationColumn(key, relations)),
  ];
});

const data = computed(() => {
  const query = props.repository.query();
  if (props.with) {
    query.with(...props.with);
  }
  return query.get();
});
</script>

<template>
  <ag-grid-vue :rowData="data" :columnDefs="columns" style="height: 500px" />
</template>
