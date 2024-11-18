<template>
  <div>
    <NuxtLayout>
      <template #title>En savoir plus sur notre système de gestion de tâches</template>

      <template #content>
        <p>
          Depuis plusieurs années, les comités utilisent des feuilles de temps basées sur Google Sheets. Les feuilles de temps permettent de définir une liste de tâches et d'inscrire les heures qui ont été réalisées par des membres pour accomplir les táches. Chaque comité a sa propre feuille de temps, et il y a un format uniforme pour toutes les feuilles de temps.
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
          Baser les feuilles de temps sur Google Sheets facilite l'utilisation compte tenu que beaucoup de gens sont familiers avec l'usage d'une feuille de calcul (comme Microsoft Excel) et qu'il suffit de cliquer sur un lien web pour accéder à la feuille. Utiliser Google Sheets apporte aussi de la flexibilité si on veut apporter des améliorations. Mais cette flexibilité peut apporter aussi des inconvénients. La disposition et structure des éléments dans une feuille calcul est fragile et est sujette à des bris accidentels. Il y a moyen de bloquer la modification de certaines cellules mais ça peut compliquer l'ajout ou modification de certains éléments, dont les noms de membre.
        </p>
        <p>
          De plus, une Google Sheets n'a pas une structure stricte, c'est-à-dire que n'importe quelle valeur peut aller dans n'importe quelle cellule. Par exemple des lettres pourraient mises dans des cellules où on s'attend à avoir des heures en nombre. Ça peut ainsi fausser des résultats et créer des incohérences. Un autre problème est que lorsqu'on veut apporter une amélioration dans une Google Sheets, il faut appliquer la même amélioration dans chacune des Google Sheets, ce qui est laborieux et sujet aux erreurs.
        </p>
        <p>
          Ces inconvénients des feuilles de calculs peuvent compliquer la compilation des données présentes dans toutes les feuilles. La compilation est nécessaire lorsque l'on veut avoir une vue globale de la participation, par exemple à des fins statistiques. Pour réaliser cette compilation, un <NuxtLink class="inline-hyperlink" to="https://github.com/ydrolet/chdlm-mini-dashboard/tree/main/scripts/google-apps">script extrait automatiquement les données dans toutes les feuilles de temps</NuxtLink>. Pour que l'extraction fonctionne bien, la disposition et structure dans chacune des Googles Sheets doit être correcte. Le script effectue des vérifications et avertit lorsqu'il y a des problèmes de disposition et structure, pour qu'ensuite des corrections manuelles soient apportées.
        </p>
        <p>
          L'extraction automatique s'exécute régulièrement (p. ex. aux 30 minutes). Le script vérifie d'abord s'il y a eu des modifications dans des Google Sheets. Si c'est le cas, le script parcourt et extrait les données de chaque ligne et colonne de chaque feuille, tout en vérifiant la disposition et structure. Le script échoue s'il y a des problèmes dans la disposition et structure et une correction manuelle est nécessaire. L'extraction automatique peut prendre jusqu'à 4 minutes à se réaliser. Les données extraites sont ensuite stockées dans une base de données avec une structure stricte. Cette fois-ci la lecture des données dans cette base de données est quasi instantanée. L'outil pour consulter son bilan de participation utilise les données qui sont dans cette base de données.
        </p>
        <p>
          Idéalement, les feuilles de temps devraient stocker directement les données dans une base de données avec une structure stricte. Mais pour réaliser cela, il faut baser les feuilles de temps sur autre chose que Google Sheets. L'idéal serait d'avoir un outil sous forme d'application web conçue sur mesure pour répondre au besoin. Un désavantage est qu'il est nécessaire d'avoir une expertise pour réaliser et maintenir ce genre d'outil.
        </p>
        <p>
          Contrairement à une feuille de calcul comme Google Sheets, une application web a une disposition et structure solide. La mise en page resterait toujours uniforme pour tous les comités. Des contraintes et validations empêcheraient d'entrées des valeurs incohérentes. Des fonctionnalités permettraient d'ajouter/enlever facilement des membres et tâches. Les améliorations dans les feuilles de temps s'appliqueraient à tous les comités instantanément. Avoir ce genre d'outil ouvrirait aussi les portes à gérer toutes les tâches de manière plus efficace.
        </p>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { isDesktopOrTablet } = useDevice()
</script>
