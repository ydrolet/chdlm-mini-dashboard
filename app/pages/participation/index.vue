<template>
  <div>
    <NuxtLayout>
      <template #title>
        Consulter son bilan de participation à la coopérative
      </template>

      <template #content>
        <div class="flex flex-col items-center gap-7">
          <p>
            Pour consulter votre bilan de participation, sélectionnez simplement votre nom dans la liste et cliquez sur <b>Envoyer le bilan à votre courriel</b>. Vous recevrez à votre courriel personnel l'information sur votre contribution à la coopérative.
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
                  :options="membersNames?.toSorted((a, b) => a.localeCompare(b, 'fr')) ?? []"
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
                  :min="MIN_PRECEDING_MONTHS"
                  :max="MAX_PRECEDING_MONTHS"
                />
                <label for="preceding-months">Mois précédents</label>
              </FloatLabel>
            </InputGroup>

            <Button
              type="submit"
              icon="pi pi-envelope"
              label="Envoyer le bilan à votre courriel"
              :loading="sendingEmail"
              :disabled="selectedMemberName === undefined"
            />
          </Form>

          <div class="border-solid border-2 rounded-xl p-2 border-orange-900 bg-orange-900/10">
            <table
              class="notices-table text-sm"
            >
              <tbody>
                <tr>
                  <th rowspan="3">
                    <i class="pi pi-exclamation-triangle text-orange-400" style="font-size: 1.8rem" />
                  </th>
                  <td>
                    Même s'il n'y a pas d'authentification pour le moment, les infos resteront toujours privées car elles iront toujours à l'adresse courriel personnelle du résident. <b>N'abusez pas en envoyant des courriels à n'importe qui.</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>
                      Dû à une limitation technique, il n'est pas possible de voir sur son bilan des données qui ont été mises à jour dans les 30 dernières minutes. Plus de détails dans la page
                      <NuxtLink
                        class="inline-hyperlink"
                        to="/participation/savoir-plus"
                      >En savoir plus
                      </NuxtLink>
                    </div>
                    <div class="pt-1">
                      La dernière modification des données remonte au {{ latestExtraction?.format("D MMMM YYYY à H:mm") || "❓" }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    Le courriel a des chances d'être considéré comme du pourriel.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-col gap-5 w-80 hyphens-none">
            <NuxtLink to="/participation/pourquoi">
              <!-- TODO: Use reference to the page title for the button label -->
              <Button
                rounded-sm
                severity="contrast"
                icon="pi pi-question-circle"
                label="Pourquoi consulter son bilan de participation ?"
                :class="$style.whyPageButton"
              />
            </NuxtLink>

            <NuxtLink to="/participation/savoir-plus">
              <!-- TODO: Use reference to the page title for the button label -->
              <Button
                rounded-sm
                severity="info"
                icon="pi pi-book"
                label="En savoir plus sur notre système de gestion de tâches"
              />
            </NuxtLink>
          </div>

          <p class="text-center hyphens-none">
            Si vous avez des questions, commentaires, suggestions ou problèmes, n'hésitez pas d'écrire à
            <NuxtLink
              class="inline-hyperlink"
              :to="`mailto:${INVOLVEMENT_COMMITTEE_EMAIL_ADDRESS}`"
            >
              {{ INVOLVEMENT_COMMITTEE_EMAIL_ADDRESS }}
            </NuxtLink>
          </p>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type {Dayjs} from "dayjs"
import type {FetchError} from "ofetch"
import {useInfo, useMembersNames, useSendMail} from "~/composables/api"

const $toast = useToast()

const defaultPrecedingMonths = 4

const sendingEmail = ref(false)

const {data: membersNames} = await useMembersNames()
const {data: info} = await useInfo()

const latestExtraction = computed<Dayjs | undefined>(() => info.value?.latestExtraction ? customDayjs(info.value?.latestExtraction) : undefined)

const selectedMemberName = useState<string | undefined>("selectedMemberName", () => undefined)
const selectedPrecedingMonths = useState<number>("selectedPrecedingMonths", () => defaultPrecedingMonths)

const sendEmail = async () => {
  if (selectedMemberName.value) {
    sendingEmail.value = true
    try {
      const response = await useSendMail({
        memberFullName: selectedMemberName.value,
        precedingMonths: selectedPrecedingMonths.value,
      })

      $toast.add({
        severity: "success",
        summary: `Le bilan a été envoyé à l'adresse courriel ${response.maskedEmailAddress}`,
        life: 10000,
      })
    }
    catch (error: unknown) {
      if ((error as FetchError)?.statusCode === 406) {
        $toast.add({
          severity: "warn",
          summary: `Il n'y a aucune adresse courriel associée à votre nom. Contactez ${INVOLVEMENT_COMMITTEE_EMAIL_ADDRESS} pour demander d'ajouter votre adresse. Si vous voulez une version imprimée de votre bilan, contactez Yannick au 819-575-7366.`,
        })
      }
      else {
        $toast.add({
          severity: "error",
          summary: "Une erreur est survenue lors de l'envoi du bilan à votre courriel",
          life: 6000
        })
      }
    }
    finally {
      sendingEmail.value = false
    }
  }
}
</script>

<style scoped>
.notices-table {
  border-collapse: separate;
  border-spacing: 0 0.5rem;

  th {
    padding-right: 1rem;
  }
}
</style>

<style module>
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
