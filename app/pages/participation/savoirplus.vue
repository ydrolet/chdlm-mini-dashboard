<template>
  <div>
    <NuxtLayout>
      <template #title>En savoir plus sur notre système de gestion de tâches</template>

      <template #content>
        <div class="flex flex-col items-center">
          <p>
            Les comités utilisent des feuilles de temps basées sur Google Sheets. Les feuilles de temps permettent de définir une liste de tâches et d'inscrire les heures qui ont été réalisées par des membres pour accomplir les táches. Chaque comité a sa propre feuille de temps, et il y a un format uniforme pour toutes les feuilles de temps.
          </p>

          <Image
            imageClass="py-3"
            src="/committeeTimesheetExample.png"
            :preview="isDesktopOrTablet"
          >
            <template #original>
              <img
                src="/committeeTimesheetExample.png"
                alt="committee timesheet example preview"
                style="width: 80vw"
              >
            </template>
          </Image>

          <p>
            Compte tenu de sa facilité d'accès et d'utilisation, Google Sheets a été utilisé pour créer les feuilles de temps. La création remonte à plusieurs années. Une Google Sheets est aussi très flexible, ce qui facilite les changements. Mais cette flexibilité peut aussi causer des inconvénients. La disposition et structure des éléments dans une Google Sheets est fragile et est sujette à des bris accidentels. Il y a moyen de bloquer la modification de parties d'une Google Sheets, mais ça peut compliquer l'ajout ou modification de certains éléments, comme les noms de membre.
          </p>
          <p>
            De plus, une Google Sheets n'a pas une structure stricte, c'est-à-dire que n'importe quelle valeur peut aller dans n'importe quelle cellule. Ça peut ainsi fausser des résultats et créer des incohérences. Un autre problème est que lorsqu'on veut apporter une amélioration dans une Google Sheets, il faut appliquer la même amélioration dans chacune des Google Sheets de chaque comité, ce qui est laborieux et sujet aux erreurs.
          </p>
          <p>
            Ces inconvénients des Google Sheets peuvent compliquer la compilation des données. La compilation des données est nécessaire lorsqu'on veut avoir une vue globale de la participation, par exemple à des fins statistiques. Pour réaliser cette compilation, actuellement un <NuxtLink class="inline-hyperlink" to="https://github.com/ydrolet/chdlm-mini-dashboard/tree/main/scripts/google-apps">programme extrait automatiquement les données dans toutes les feuilles de temps</NuxtLink>. Pour que l'extraction fonctionne bien, la disposition et structure dans chacune des Googles Sheets doit être correcte. Le programme effectue des vérifications et avertit lorsqu'il y a des problèmes de disposition et structure, pour qu'ensuite des corrections manuelles soient apportées.
          </p>
          <p>
            L'extraction automatique s'exécute aux 30 minutes. Le programme parcourt et extrait les données de chaque ligne et colonne de chaque feuille, tout en vérifiant la disposition et structure. Le programme échoue s'il y a des problèmes dans la disposition et structure. Une correction manuelle devient donc nécessaire. L'extraction automatique peut prendre jusqu'à 5 minutes pour compléter. Les données extraites sont ensuite stockées dans une base de données avec une structure stricte. Cette fois-ci la lecture des données dans cette base de données est quasi instantanée. L'outil pour consulter son bilan de participation utilise les données qui sont dans cette base de données. Le bilan de participation envoyé par courriel ressemble à ceci :
          </p>

          <Image
            imageClass="py-3"
            :imageStyle="{ height: '30rem' }"
            src="/involvementSummaryEmailExample.png"
            :preview="isDesktopOrTablet"
          >
            <template #original>
              <img
                src="/involvementSummaryEmailExample.png"
                alt="involvement summary email example preview"
                style="height: 90vh"
              >
            </template>
          </Image>

          <p>
            Cette façon de faire avec l'extraction automatique dans les Google Sheets fonctionne bien, mais n'est pas pérenne et robuste. Idéalement, les feuilles de temps devraient stocker directement les données dans une base de données avec une structure stricte. Mais pour réaliser cela, il faut baser les feuilles de temps sur autre chose que Google Sheets. L'idéal serait d'avoir un outil sous forme d'application web conçue sur mesure. Une difficulté est qu'il est nécessaire d'avoir une expertise pour réaliser et maintenir ce genre d'outil.
          </p>
          <p>
            Contrairement à une feuille de calcul comme Google Sheets, une application web a une disposition et structure solide. La mise en page resterait toujours uniforme pour tous les comités. Des contraintes et validations empêcheraient d'entrées des valeurs incohérentes. Des fonctionnalités permettraient d'ajouter/enlever facilement des membres et tâches. Les améliorations dans les feuilles de temps s'appliqueraient à tous les comités instantanément. Avoir ce genre d'outil permettrait aussi de gérer de manière plus efficace toutes les tâches essentielles au bon fonctionnement de notre coopérative d'habitation.
          </p>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { isDesktopOrTablet } = useDevice()
</script>
