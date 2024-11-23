<template>
  <div>
    <NuxtLayout>
      <template #title>
        Consulter son bilan de participation à la coopérative
      </template>

      <template #content>
        <div class="flex flex-col items-center gap-7">
          <p>
            Pour consulter votre bilan de participation, sélectionnez simplement votre nom dans la liste et cliquez sur <b>Envoyer par courriel</b>. Vous recevrez à votre courriel personnel l'information sur votre contribution à la coopérative.
          </p>

          <Form
            class="flex flex-col items-center gap-3.5 w-80"
            @submit="sendEmail"
          >
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-user" />
              </InputGroupAddon>
              <FloatLabel variant="on">
                <Select
                  v-model="selectedMemberName"
                  inputId="member-name"
                  :options="membersNames ?? []"
                />
                <label for="member-name">Nom du résident</label>
              </FloatLabel>
            </InputGroup>

            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-calendar" />
              </InputGroupAddon>
              <FloatLabel variant="on">
                <InputNumber
                  v-model="selectedPrecedingMonths"
                  inputClass="text-center"
                  inputId="preceding-months"
                  pt:pcInputText:root:inputmode="none"
                  showButtons
                  buttonLayout="horizontal"
                  decrementIcon="pi pi-minus"
                  incrementIcon="pi pi-plus"
                  :step="1"
                  :min="info?.minPrecedingMonths ?? defaultPrecedingMonths"
                  :max="info?.maxPrecedingMonths ?? defaultPrecedingMonths"
                />
                <label for="preceding-months">Mois précédents</label>
              </FloatLabel>
            </InputGroup>

            <Button
              type="submit"
              icon="pi pi-envelope"
              label="Envoyer le bilan à votre courriel"
              :loading="sendingEmail"
              :disabled="!selectedMemberName"
            />
          </Form>

          <table
            id="notices-table"
            class="text-sm"
          >
            <tbody>
              <tr>
                <th rowspan="2">
                  <i class="pi pi-exclamation-triangle text-2xl text-orange-400" />
                </th>
                <td>
                  Même s'il n'y a pas d'authentification pour le moment, les infos resteront toujours privées car elles iront toujours à l'adresse courriel personnelle du résident. <b>N'abusez pas en envoyant des courriels à n'importe qui.</b>
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    Dû à une limitation technique, les données sont mises à jour aux 30 minutes. Plus de détails dans la page
                    <NuxtLink
                      class="inline-hyperlink"
                      to="/participation/savoirplus"
                    >En savoir plus
                    </NuxtLink>
                  </div>
                  <div class="pt-1 flex flex-wrap">
                    <span>Dernière modification des données :&nbsp;</span>
                    <span>{{ latestExtraction.format("LLL") }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex flex-col gap-5 w-80 hyphens-none">
            <NuxtLink to="/participation/pourquoi">
              <!-- TODO: Use reference to the page title for the button label -->
              <Button
                rounded
                severity="contrast"
                icon="pi pi-question-circle"
                label="Pourquoi consulter son bilan de participation ?"
                :class="$style.whyPageButton"
              />
            </NuxtLink>

            <NuxtLink to="/participation/savoirplus">
              <!-- TODO: Use reference to the page title for the button label -->
              <Button
                rounded
                severity="info"
                icon="pi pi-book"
                label="En savoir plus sur notre système de gestion de tâches"
              />
            </NuxtLink>
          </div>

          <p class="text-center hyphens-none">
            Si vous avez des questions, commentaires, suggestions ou problèmes, n'hésitez pas à écrire à
            <NuxtLink
              class="inline-hyperlink"
              to="mailto:participation@coopdelamontagne.com"
            >
              participation@coopdelamontagne.com
            </NuxtLink>
          </p>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type {Dayjs} from "dayjs"

const {$chdlm} = useNuxtApp()
const $dayjs = useDayjs()
const $toast = useToast()

const defaultPrecedingMonths = 3

const sendingEmail = ref(false)

const {data: membersNames} = await useChdlm("/data/members", {lazy: true, server: false})
const {data: info} = await useChdlm("/info/", {lazy: true, server: false})

const latestExtraction = computed<Dayjs>(() => $dayjs(info.value?.latestExtraction))

const selectedMemberName = useState<string | null>("selectedMemberName", () => null)
const selectedPrecedingMonths = useState<number>("selectedPrecedingMonths", () => defaultPrecedingMonths)

const sendEmail = () => {
  if (selectedMemberName.value) {
    sendingEmail.value = true
    $chdlm("/command/send-email", {
      method: "POST",
      body: {
        memberFullName: selectedMemberName.value,
        precedingMonths: selectedPrecedingMonths.value
      },
      onResponse: ({response}) => {
        if (response.ok) {
          $toast.add({
            severity: "success",
            summary: `Le bilan a été envoyé avec succès à l'adresse courriel ${response._data.maskedEmailAddress}`,
            life: 8000,
          })
        }
      }
    }).catch(() => {
      $toast.add({
        severity: "error",
        summary: "Une erreur est survenue lors de l'envoi du bilan à votre courriel",
        life: 5000
      })
    }).finally(() => {
      sendingEmail.value = false
    })
  }
}
</script>

<style scoped lang="scss">
#notices-table {
  border-collapse: separate;
  border-spacing: 0 0.5rem;

  th {
    padding-right: 1rem;
  }

  td {
    text-align: justify;
  }
}
</style>

<style module lang="scss">
.whyPageButton {
  animation: pulse 4s infinite;
}

@keyframes pulse {
  0%, 100% {
    filter: drop-shadow(0 0 3px white);
  }

  50% {
    filter: drop-shadow(0 0 12px white);
  }
}
</style>
