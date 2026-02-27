src/
  app/
    App.tsx
    router/
    providers/
    layout/

  services/         // infrastructure (SOLID: dependencies stay here)
    http/           // axios instance, interceptors
    query/          // queryClient, key factories
    auth/           // token, permission helpers

  rms/              // your RMA engine rms (reusable module system)
    R-Module/
    Table/
    Form/
    types.ts

  modules/          // feature-based
    overview/
      ui/
      domain/
      services/
      index.ts
    users/
      ui/
      domain/
      services/
      crud/
      index.ts
    jobs/
      ...

  shared/           // cross-feature reuse (no business logic)
    ui/
      Button/
      Breadcrumbs/
      InfoBox/
      Charts/
    hooks/
    utils/
    types/
    constants/

  store/            // zustand slices: auth, permissions, ui
  assets/# RMA
