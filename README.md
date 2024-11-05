## ¿Cómo iniciar el proyecto?

Para iniciar el proyecto en modo de desarrollo ejecta:

```bash
npm run dev
```

Para construir el proyecto ejecuta:

```bash
npm run build
```

## ¿Cómo se manejan los estilos?

Los estilos se manejan utilizando sass modules para evitar que haya choque de estilos. Para utilizarlos debes nombrar tus archivos (dentro de algún componente o página):

```
index.module.scss
```

En el componente los importas de la siguiente manera:

```tsx
import styles from './index.module.scss';
```

Adicionalmente, el template viene con una utilidad para usar estilos de módulos:

```tsx
import { classNames } from 'primereact/utils';
```

Para aplicar alguna clase de las definidas en el archivo _“index.module.scss”_ digamos la clase _“p-button”_:

```scss
/* index.module.scss */
.p-button {
    padding: 0%;
}
/* ... */
```

Para aplicar esta clase a un elemento JSX se haría de la siguiente manera (también puedes acceder a la propiedad usando punto):

```tsx
<Button className={classNames(styles['p-button'], styles['twitter'])} aria-label="Twitter">...
```

Puedes añadir multiples clases

```tsx
className={classNames('w-2rem h-2rem mr-2 ', color.background)}
```

Y añadir condicionales

```tsx
className={classNames('w-1rem h-1rem border-circle border-2 ', {
'bg-green-400': props.user.status === 'active',
 styles['myClass']: props.user.status === 'busy',
 styles.myClass2: props.user.status === 'away'
})}
```

También es importante mencionar que las clases de [PrimeFlex](https://primeflex.org/installation) están disponibles en el proyecto.

## Estructura del proyecto

El proyecto tiene la configuración inicial dónde

```
app               # contiene las rutas como son establecidos por Next.js (v13)
features          # contiene las features de la aplicación
layout            # contiene los elementos para los layout (del template)
public            # contiene archivos estáticos: iconos, imagénes, estilos, JSON...
styles            # contiene estilos globales de la aplicación
types             # contiene tipos globales de la aplicación
hooks             # contiene los hooks globales de la aplicación
lib               # contiene código dónde se hace uso de librerías
components        # contiene componentes globales de la aplicación
config            # variables de entorno o configuración de la aplicación
context           # contexto globales de la aplicación
middleware.ts     # Next.js (v13) middleware
.
.
.
```

### app

El folder _app_ es propio de Next.js (v13) y en este se definen las rutas siguiendo una regla específica que puedes consultar en [Getting Started: Project Structure](https://nextjs.org/docs/getting-started/project-structure).

Cómo así se deben declarar las rutas, en cada archivo se sigue la estructura (se pueden agrupar rutas con paréntesis para mayor organización), y en el momento de estar en el archivo de página _page.tsx._ Se importa su respectiva página correspondiente de la feature específica de dicha página. Ejemplo:

```tsx
// app/(full-page)/auth/login/page.tsx
import LoginPage from '@/features/auth/pages/LoginPage/LoginPage';
export default LoginPage;
```

### features

Dentro de esta carpeta está cada feature correspondiente al proyecto:

```
features
|
+-- auth                # manejo de la autenticación
+-- configuration       # manejo de los maestros de la aplicación
.
.
.
```

Cada feature tiene la siguiente estructura:

```
feature
|
+-- pages           # contiene componentes que representan una ruta en específico
|		+
|   +-- Page1       # contiene el componente "Page1.tsx" e "index.module.scss"
|   .
|   .
+-- componentes     # contiene componentes de la feature
|		+
|   +-- Component1  # contiene el componente "Component1.tsx" e "index.module.scss"
|   .
|   .
+-- services       # contiene los servicios de la feature
|		+
|   +-- task.service.ts
|   .
|   .
+-- hooks          # contiene hooks de la feature
+-- context        # contiene contexto de la feature
+-- layout         # contiene uno o varios layouts de la feature
+-- types          # contiene los tipos de la feature
+-- helpers        # contiene funciones específicas de la feature
+-- assets         # contiene assets de la feature
.
.
.
```

**Es importante tener presente, que las páginas sólo se exportan en la carpeta _app_ para definir la ruta en cuestión. Ningún componente u otro elemento de una feature se debe importar desde otra feature. Si vas a usar algún elemento que se vaya a utilizar en diferentes features debería ser global.**

### layout

En el layout están los componentes correspondientes al layout que se maneja en la plantilla junto a su configuración. También se podría colocar cualquier Layout que require ser global. Cabe resaltar que para usar algún layout se hace uso de la carpeta _app_ colocando el archivo _layout.tsx_ en la ruta en dónde aplica el layout.

### public

Dentro de esta carpeta la estructura será:

```
features  # contiene los assets por feature
images    # contiene imágenes globales usados en toda la aplicación
icons     # contiene iconos globales usados ent toda la aplicación
data      # contiene archivos (JSON) usados en toda la aplicación
layout    # contiene assets del layout (plantilla)
styles    # contiene estilos de la plantilla
.
.
.
```

Dónde dentro de la carpeta features, se encuentra (en caso de tener assets) la carpeta de alguna feature y dentro pueden contener las mismas carpetas (images, icons, data) correspondientes a la feature (NOTA: los estilos de los componentes no se definen en esta carpeta).

_Cabe notar que este componente es importante en Next.js, ya que los assets declarados aquí son públicos y se pueden acceder por ruta._

### styles

En esta carpeta se encuentra los estilos globales de la aplicación:

```
features                # contiene los estilos por feature
layout                  # Estilos del layout de la plantilla
global                  # Se importan los estilos de la carpeta "features"
|
+-- global.scss         # este archivo es importado en el layout principal.
.
.
.
```

Cómo es usual (como se ha presentado en otros proyectos) cambiar los estilos globales en un componente específico, aquí dentro de la carpeta “features” estaría la carpeta a la feature correspondiente dónde se debe incluir un archivo principal “feature.scss” (dónde feature es el nombre de la feature) y en el archivo global.scss se debe importar este archivo para que esté incluido en los estilos globales.

**Cabe notar que esta no debería ser la forma de escribir los estilos para componentes o páginas, pero en ciertas ocasiones puede tener sentido declarar el estilo globalmente para que sean aplicados en algún elemento en específico.**

### types

Contiene los tipos globales de la aplicación.

### hooks

Contiene los hooks globales de la aplicación.

### lib

Contiene los archivos que hacen uso de librería de terceros y los exporta en algún objecto para ser utilizado en la aplicación.

### components

Contiene componentes globales de la aplicación.

### config

Contiene las variables de entorno de la aplicación. El archivo env.ts, es de dónde se exportan las variables de entorno que se pueden declarar en un archivo .env en la ruta del proyecto.

```
// config/env.ts
export const env = ({
    API_URL: process.env.NEXT_PUBLIC_API_URL
});
```

```
// .env
NEXT_PUBLIC_API_URL=valorDeEjemplo
```

### context

Contiene contextos globales de la aplicación.


### for prod deploy
 npm install      
npm run build --prod