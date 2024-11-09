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
                <label for="member-name">Nom du membre</label>
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
                  Même s'il n'y a pas d'authentification pour le moment, les infos resteront toujours privées car elles iront toujours à l'adresse courriel personnelle du membre. <b>N'abusez pas en envoyant des courriels à n'importe qui.</b>
                </td>
              </tr>
              <tr>
                <td>
                  Dû à une limitation technique, les données sont mises à jour aux 30 minutes. Plus de détails dans la page
                  <NuxtLink
                    class="inline-hyperlink"
                    to="/participation/savoirplus"
                  >En savoir plus</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex flex-col gap-5 w-80 hyphens-none">
            <NuxtLink to="/participation/pourquoi">
              <Button
                rounded
                severity="contrast"
                icon="pi pi-question-circle"
                label="Pourquoi consulter son bilan de participation ?"
              />
            </NuxtLink>

            <NuxtLink to="/participation/savoirplus">
              <Button
                rounded
                severity="info"
                icon="pi pi-book"
                label="En savoir plus sur notre système de gestion de tâches"
              />
            </NuxtLink>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const {$chdlm} = useNuxtApp()

const defaultPrecedingMonths = 3

const {data: membersNames} = await useChdlm("/data/members")
const {data: info} = await useChdlm("/info/")

const selectedMemberName = useState<string | null>("selectedMemberName", () => null)
const selectedPrecedingMonths = useState<number>("selectedPrecedingMonths", () => defaultPrecedingMonths)

const sendEmail = () => {
  if (selectedMemberName.value) {
    $chdlm("/command/send-email", {
      method: "POST",
      body: {
        memberFullName: selectedMemberName.value,
        precedingMonths: selectedPrecedingMonths.value
      }
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
