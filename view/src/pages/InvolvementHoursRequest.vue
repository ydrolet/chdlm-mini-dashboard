<template>
  <q-page class="row justify-center q-pa-md">
    <div class="column items-center text-center" style="max-width: 600px">
      <h5 class="q-my-md">
        Outil pour consulter ses heures de participation à la coopérative
      </h5>

      <div>
        <p>
          Tout comme un propriétaire d'une maison individuelle ou d'un bloc d'appartements, les membres dans une
          coopérative d'habitation ont des responsabilités importantes pour s'assurer du bon fonctionnement de notre
          environnement. Idéalement, tous les membres devraient répondre aux besoins de la coopérative à part égale.
          Pour atteindre cet idéal, il faut être structuré. L'enregistrement des heures de participation permettent
          entre autres d'avoir une mesure pour aider à la répartition des tâches.
        </p>
        <p>
          En consultant régulièrement vos heures de participation pour vous vous assurer que ce qui est enregistré
          reflète bien ce que vous avez accompli réellement, vous aidez à avoir des données précieuses pour la
          gestion/répartition globale de tâches. Merci de prendre le temps de vérifier régulièrement vos heures de
          participation.
        </p>
        <p class="text-bold">
          Plus il y a de structure et de rigueur dans notre travail, plus la vie dans notre communauté sera simple et
          agréable et plus nous pourrons mettre de l'énergie dans des projets qui nous tiennent à coeur ❤️
        </p>
      </div>

      <div class="column items-center q-mt-lg">
        <p>
          Pour consulter vos heures de participation, sélectionnez simplement votre nom dans la liste et cliquez sur <b>Envoyer
          par courriel</b>. Vous recevrez à votre courriel personnel l'information sur votre contribution à la
          coopérative.
        </p>

        <table>
          <tbody>
          <tr>
            <td>
              <q-icon name="warning" color="warning" size="md" />
            </td>
            <td>
              <div class="text-left q-pl-sm" style="font-size: 0.8rem;">
                Même s'il n'y a pas d'authentification pour le moment, les infos resteront toujours privées car elles
                iront toujours à l'adresse courriel personnelle du membre. Malgré tout, <b>n'abusez pas en envoyant des
                courriels à n'importe qui.</b>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <q-form
          class="q-gutter-md q-mt-xs q-mb-lg"
          style="width: 340px;"
          @submit="onSubmit"
        >
          <q-select
            v-model="memberName"
            filled
            :options
            label="Nom du membre"
          />

          <div class="q-py-sm" style="background-color: rgba(255, 255, 255, 0.07);">
            <span class="months-select-text">Pour les</span>
            <q-avatar class="q-mx-xs" size="lg" color="dark">{{ precedingMonths }}</q-avatar>
            <span class="months-select-text">derniers mois</span>

            <q-btn
              class="q-ml-md"
              round
              size="md"
              color="primary"
              icon="remove"
              :disable="precedingMonths <= 3"
              @click="() => { precedingMonths -= 1 }"
            />
            <q-btn
              class="q-ml-lg"
              round
              size="md"
              color="primary"
              icon="add"
              :disable="precedingMonths >= maxPrecedingMonths"
              @click="() => { precedingMonths += 1 }"
            />
          </div>

          <div class="q-mt-lg">
            <q-btn
              label="Envoyer à votre courriel"
              icon="mail"
              type="submit"
              color="positive"
              size="md"
              no-caps
              rounded
            />
          </div>
        </q-form>
      </div>

      <div class="q-mt-lg">
        <q-btn
          color="info"
          no-caps
          rounded
          style="max-width: 280px"
        >
          <q-icon left name="import_contacts" />
          <div style="width: 80%">
            En savoir plus sur notre système de gestion de tâches
          </div>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue"

const memberName = ref<string | null>(null)
const precedingMonths = ref<number>(3)

const maxPrecedingMonths = 24

const onSubmit = () => {
  console.log("submit", memberName.value, precedingMonths.value)
}

const options = [
  "ExampleName1",
  "ExampleName2",
  "ExampleName3",
  "ExampleName4"
]
</script>

<style scoped lang="scss">
h5 {
  color: $secondary;
}

.months-select-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}
</style>
