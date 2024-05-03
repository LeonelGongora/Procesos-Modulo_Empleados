import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout";
import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage";
import DashboardIndex from "../pages/dashboard/DashboardIndex";
import ChangelogPage from "../pages/changelog/ChangelogPage";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage";
import SaasPage from "../pages/dashboard/SaasPage";
import ComponentPageLayout from "../pages/component/ComponentPageLayout";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AlertPage from "../pages/component/AlertPage";
import ButtonPage from "../pages/component/ButtonPage";
import DocumentationPage from "../pages/documentation/DocumentationPage";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BuildIcon from "@mui/icons-material/Build";
import ApartmentIcon from "@mui/icons-material/Apartment";
import NotificationPage from "../pages/notifications/NotificationPage";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EmployePage from "../pages/employes/EmployePage";
import EngineeringIcon from "@mui/icons-material/Engineering";

import CrearDepa from "../departamento/components/CrearDepartamento.js";
import Depa from "../departamento/components/MostrarDep.js";
import EditarDep from "../departamento/components/EditarDep.js";
import RegistrarResidente from "../departamento/components/CrearResidente";
import CrearContrato from "../departamento/components/CrearContrato";
import InfoDepartamento from "../departamento/components/InfoDepartamento";
import MostrarResidentes from "../departamento/components/MostrarResidentes";

import Equipos from "../cobro_servicios/components/gestionEquipos.js";
import AgregarEquipo from "../cobro_servicios/components/AgregarEquipo.js";

import Cobros from "../cobro_servicios/components/gestionCobros.js";
import CobrosLayout from "../pages/dashboard/CobrosLayout";

import EmployeHomePage from "../empleados/pages/homePageEmpleados";
import EmployeeEdit from "../empleados/pages/employee_edit";
import EmployeeRegister from "../empleados/pages/employee_register";
import DashboardEmployee from "../pages/dashboard/DashboardEmployee";
import ContractRegister from "../empleados/pages/contract_register";
import AssignContract from "../empleados/pages/assign_contract";
import AssignTurn from "../empleados/pages/assign_turn";
import TurnRegister from "../empleados/pages/turn_register";

import CommonAreasLayout from "../common-areas/CommonAreasLayout";
import CreatePage from "../common-areas/pages/create-page/CreatePage";
import ListPage from "../common-areas/pages/list-page/ListPage";
import UpdatePage from "../common-areas/pages/update-page/UpdatePage";
import CalendarPage from "../common-areas/pages/calendar-page/CalendarPage";
import ReservationPage from "../common-areas/pages/reservation-page/ReservationPage";

import { RegistrarPersona } from "../notificaciones/pages/registrarPersona";
import { SendTelegramNotification } from "../notificaciones/pages/sendTelegramNotification";
import { NotificationsList } from "../notificaciones/pages/NotificationsList";
import NotificationEmail from "../notificaciones/pages/NotificationEmail";
import PersonalPage from "../mantenimiento/personal/PersonalPage";
import RegistroServicioPage from "../mantenimiento/registro_servicio/RegistroServicioPage";
import ListaSolicitudServicioPage from "../mantenimiento/lista_solicitud/ListaSolicitudServicioPage";
import ChangelogPageLayout from "../mantenimiento/ChangelogPageLayout";
import Changelog from "../pages/changelog/ChangelogPage";

import GestionEquipos from "../cobro_servicios/components/gestionEquipos.js";
import EditarEquipo from "../cobro_servicios/components/editarEquipo";
import GenerarPreAviso from "../cobro_servicios/components/Pre-aviso";


const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },

  {
    path: "/dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Departamentos",
      icon: <ApartmentIcon />
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "dashboard.index"
      },
      {
        path: "/dashboard/crearDepa",
        element: <CrearDepa />,
        state: "dashboard.crearDepa",
        sidebarProps: {
          displayText: "Crear Departamento"
        },
      },
      {
        path: "/dashboard/departamentos",
        element: <Depa />,
        state: "dashboard.depa",
        sidebarProps: {
          displayText: "Gestionar Departamento"
        },
      },
      {
        path: "/dashboard/RegResidente",
        element: <RegistrarResidente />,
        state: "dashboard.depa",
        sidebarProps: {
          displayText: "Registrar Residente"
        },
      },
      {
        path: "/dashboard/editarDepa",
        element: <EditarDep />,
        state: "dashboard.depa",
      },
      {
        path: "/dashboard/crearContrato",
        element: <CrearContrato />,
        state: "dashboard.depa",
      },
      {
        path: "/dashboard/infoDepartamento",
        element: <InfoDepartamento />,
        state: "dashboard.depa",
      },
      {
        path: "/dashboard/residentes",
        element: <MostrarResidentes />,
        state: "dashboard.depa",
        sidebarProps: {
          displayText: "Residentes"
        },
      },
      // {
      //   path: "/dashboard/analytics",
      //   element: <AnalyticsPage />,
      //   state: "dashboard.analytics",
      //   sidebarProps: {
      //     displayText: "Habitaciones"
      //   }
      // },
      // {
      //   path: "/dashboard/saas",
      //   element: <SaasPage />,
      //   state: "dashboard.saas",
      //   sidebarProps: {
      //     displayText: "Parqueos"
      //   }
      // }
    ]
  },
  {
    path: "/cobros",
    element: <CobrosLayout />,
    state: "component",
    sidebarProps: {
      displayText: "Cobro por Servicios",
      icon: <MonetizationOnIcon />,
    },
    child: [
      {
        path: "/cobros/pre-aviso",
        element: <Cobros />,
        state: "cobros.alert",
        sidebarProps: {
          displayText: "Generar pre-aviso",
        },
      },
      {
        path: "/cobros/agregar-equipo",
        element: <AgregarEquipo />,
        state: "component.button",
        sidebarProps: {
          displayText: "Agregar equipo dañado",
        },
      },
      {
        path: "/cobros/gestion-equipo",
        element: <GestionEquipos />,
        state: "cobros.alerta",
        sidebarProps: {
          displayText: "Gestion de equipos dañados",
        },
      },
      {
        path: "/cobros/edicion-equipo/:id",
        element: <EditarEquipo />,
        state: "cobros.editar-equipo",
      },
      {
        path: "/cobros/generar-preaviso/:departamento_id",
        element: <GenerarPreAviso/>,
        state: "cobros.generar-pre-aviso",
        
      },
    ],
  },
  {
    path: "/areas-comunes",
    element: <CommonAreasLayout />,
    state: "areas-comunes",
    sidebarProps: {
      displayText: "Areas Comunes",
      icon: <ApartmentIcon />,
    },
    child: [
      {
        path: "/areas-comunes/crear",
        element: <CreatePage />,
        state: "areas-comunes.registrar",
        sidebarProps: {
          displayText: "Crear Area Comun",
        },
      },
      {
        path: "/areas-comunes",
        element: <ListPage />,
        state: "areas-comunes.listar",
        sidebarProps: {
          displayText: "Listar Areas Comunes",
        },
      },
      {
        path: "/areas-comunes/:id",
        element: <UpdatePage />,
        state: "areas-comunes.actualizar",
      },
      {
        path: "/areas-comunes/calendario/:id",
        element: <CalendarPage />,
        state: "areas-comunes.calendario",
      },
      {
        path: "/areas-comunes/reservar/:id",
        element: <ReservationPage />,
        state: "areas-comunes.reservar",
      },
    ],
  },

  {
    path: "/changelog",
    element: <ChangelogPageLayout />,
    state: "changelog",
    sidebarProps: {
      displayText: "Mantenimiento",
      icon: <BuildIcon />,
    },
    child: [
      {
        path: "/changelog/registrar_servicio",
        element: <Changelog />,
        state: "changelog.servicio",
        sidebarProps: {
          displayText: "Registrar servicio",
        },
      },
      {
        path: "/changelog/personal",
        element: <PersonalPage />,
        state: "changelog.personal",
        sidebarProps: {
          displayText: "Personal",
        },
      },
      {
        path: "/changelog/registro",
        element: <RegistroServicioPage />,
        state: "changelog.registro",
        sidebarProps: {
          displayText: "Registro",
        },
      },
      {
        path: "/changelog/solicitud",
        element: <ListaSolicitudServicioPage />,
        state: "changelog.solicitud",
        sidebarProps: {
          displayText: "Solicitud",
        },
      },
    ],
  },

  {
    path: "/notifications",
    element: <NotificationPage />,
    state: "notification",
    sidebarProps: {
      displayText: "Notificaciones",
      icon: <NotificationsActiveIcon />,
    },
    child: [
      {
        path: "/notifications/registrar",
        element: <RegistrarPersona />,
        state: "usuario.registrar",
        sidebarProps: {
          displayText: "Registro Persona",
        },
      },
      {
        path: "/notifications/list",
        element: <NotificationsList />,
        state: "notificacion.lista",
        sidebarProps: {
          displayText: "Lista de Notificaciones",
        },
      },
      {
        path: "/notifications/email",
        element: <NotificationEmail />,
        state: "notificacion.email",
        sidebarProps: {
          displayText: "Enviar email",
        },
      },
      {
        path: "/notifications/send/telegram",
        element: <SendTelegramNotification />,
        state: "telegram.enviar",
      },
    ],
  },

  {
    path: "/employees",
    element: <DashboardEmployee />,
    state: "employee",
    sidebarProps: {
      displayText: "Empleados",
      icon: <EngineeringIcon />,
    },
    child: [
      {
        index: true,
        element: <EmployeHomePage />,
        state: "employee.index",
      },
      {
        path: "/employees/default",
        element: <EmployeHomePage />,
        state: "employee.default",
        sidebarProps: {
          displayText: "Pagina Principal",
        },
      },
      {
        path: "/employees/employeeRegister",
        element: <EmployeeRegister />,
        state: "employee.analytics",
        sidebarProps: {
          displayText: "Registro",
        },
      },

      {
        path: "/employees/assignContract",
        element: <AssignContract />,
        state: "employee.analytics",
        sidebarProps: {
          displayText: "Asignar contrato",
        },
      },

      {
        path: "/employees/assignTurn",
        element: <AssignTurn />,
        state: "employee.analytics",
        sidebarProps: {
          displayText: "Asignar turnos",
        },
      },

      {
        path: "/employees/employeeEdit",
        element: <EmployeeEdit />,
        state: "employee.analytics",
      },

      {
        path: "/employees/contractRegister",
        element: <ContractRegister />,
        state: "employee.analytics",
      },


      {
        path: "/employees/turnRegister",
        element: <TurnRegister/>,
        state: "employee.analytics",
      },
    ],
  },
];

export default appRoutes;
