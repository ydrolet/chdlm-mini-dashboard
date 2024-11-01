<template>
  <basic-page>
    <template #title>
      Consulter son bilan de participation à la coopérative
    </template>

    <template #content>
      <p>
        Pour consulter votre bilan de participation, sélectionnez simplement votre nom dans la liste et cliquez sur <b>Envoyer par courriel</b>. Vous recevrez à votre courriel personnel l'information sur votre contribution à la coopérative.
      </p>

      <q-form
        class="v-center"
        style="margin: 1.5rem 0; gap: 1rem;"
        @submit="onSendEmail"
      >
        <q-select
          v-model="selectedMemberName"
          filled
          :options="membersNames"
          label="Nom du membre"
          style="width: 100%;"
        />

        <div id="preceding-months">
          <span class="months-select-text">Pour les</span>
          <q-avatar class="q-mx-xs" size="lg" color="dark">{{ selectedPrecedingMonths }}</q-avatar>
          <span class="months-select-text">derniers mois</span>

          <q-btn
            class="q-ml-md"
            round
            size="md"
            color="primary"
            icon="remove"
            :disable="selectedPrecedingMonths <= minPrecedingMonths"
            @click="() => { selectedPrecedingMonths -= 1 }"
          />
          <q-btn
            class="q-ml-lg"
            round
            size="md"
            color="primary"
            icon="add"
            :disable="selectedPrecedingMonths >= maxPrecedingMonths"
            @click="() => { selectedPrecedingMonths += 1 }"
          />
        </div>

        <q-btn
          label="Envoyer le bilan à votre courriel"
          icon="mail"
          type="submit"
          color="positive"
          size="md"
          no-caps
          rounded
          style="margin-top: 0.7rem;"
        />
      </q-form>

      <table id="notices-table" class="text-body2">
        <tbody>
        <tr>
          <th>
            <q-icon name="warning" color="warning" size="md"/>
          </th>
          <td>
            Même s'il n'y a pas d'authentification pour le moment, les infos resteront toujours privées car elles iront toujours à l'adresse courriel personnelle du membre. <b>N'abusez pas en envoyant des courriels à n'importe qui.</b>
          </td>
        </tr>
        <tr>
          <th>
            <q-icon name="info" color="info" size="md"/>
          </th>
          <td>
            <div>
              Dû à une limitation technique, les données sont mises à jour aux 30 minutes. Plus de détails dans la page <a class="inline-hyperlink" href="/savoirplus">En savoir plus</a>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="v-center" style="gap: 1.2rem; margin-top: 1.6rem;">
        <q-btn
          color="warning"
          no-caps
          rounded
          style="max-width: 20rem"
          to="/pourquoi"
        >
          <q-icon left name="help_outline"/>
          <div style="width: 80%">
            Pourquoi consulter son bilan de participation ?
          </div>
        </q-btn>

        <q-btn
          color="info"
          no-caps
          rounded
          style="max-width: 20rem"
          to="/savoirplus"
        >
          <q-icon left name="import_contacts"/>
          <div style="width: 80%">
            En savoir plus sur notre système de gestion de tâches
          </div>
        </q-btn>
      </div>
    </template>
  </basic-page>
</template>

<script setup lang="ts">
import BasicPage from "layouts/BasicPage.vue"
import {onMounted, ref} from "vue"
import {CommandService, DataService, InfoService} from "src/clients/chdlm"

const defaultPrecedingMonths = 3

let membersNames = ref<string[]>([])
let minPrecedingMonths = ref<number>(defaultPrecedingMonths)
let maxPrecedingMonths = ref<number>(defaultPrecedingMonths)

const selectedMemberName = ref<string | null>(null)
const selectedPrecedingMonths = ref<number>(defaultPrecedingMonths)

const onSendEmail = () => {
  if (selectedMemberName.value) {
    CommandService.sendInvolvementSummaryEmail({
      body: {
        memberFullName: selectedMemberName.value,
        precedingMonths: selectedPrecedingMonths.value
      }
    })
  }
}

onMounted(async () => {
  const {data: membersData} = await DataService.getMembersList()
  if (membersData) {
    membersNames.value = membersData
  }

  const {data: info} = await InfoService.getInfo()
  if (info) {
    minPrecedingMonths.value = info.minPrecedingMonths
    maxPrecedingMonths.value = info.maxPrecedingMonths
  }
})
</script>

<style scoped lang="scss">
#notices-table {
  border-collapse: separate;
  border-spacing: 0 0.5rem;

  th {
    padding-right: 0.8rem;
  }

  td {
    text-align: justify;
    font-size: 0.8rem;
  }
}

#preceding-months {
  background-color: rgba(255, 255, 255, 0.07);
  padding: 0.5rem 0.8rem;
}

.months-select-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}
</style>
