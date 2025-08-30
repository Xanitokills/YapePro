PymeYapePro
  
PymeYapePro es una plataforma multi-tenant diseñada para optimizar las operaciones de pequeñas y medianas empresas (PYMES). Construida sobre PostgreSQL/Supabase, ofrece una solución integral para gestionar ventas, inventario, recursos humanos, compras, promociones y conciliación de pagos, con integración fluida para transacciones de Yape. Está optimizada para el mercado peruano (zona horaria America/Lima, moneda PEN), con un enfoque en escalabilidad, seguridad y facilidad de uso.
Tabla de Contenidos

Características Principales
Arquitectura Técnica
Casos de Uso
Beneficios
Datos Iniciales
Instalación
Contribución
Licencia

Características Principales
Multi-Tenancy

Inquilinos (Tenants): Cada negocio opera como un inquilino independiente con datos aislados.
Suscripciones y Planes: Planes configurables (Gratis, Pro) con derechos como número máximo de tiendas y empleados.
Roles de Usuario: Roles jerárquicos (Propietario, Administrador, Personal, Observador) con Row-Level Security (RLS).

Ventas (POS)

Órdenes: Generación automática de códigos de referencia y seguimiento de ventanas de pago.
Ítems de Orden: Registro detallado de productos vendidos, vinculados a inventario.
Estado de Pago: Soporta estados como Pendiente, Pagado, Reembolsado, Fallido, con actualización automática de stock.

Integración con Yape y Conciliación

Transacciones Yape: Análisis y emparejamiento de notificaciones Yape con órdenes.
Conciliación: Procesos automáticos y manuales con puntuación de confianza y auditoría.
Configuración de Análisis: Patrones personalizables para montos, remitentes y conceptos.

Gestión de Inventario

Niveles de Stock: Seguimiento por tienda con alertas de stock mínimo.
Movimientos de Inventario: Registra compras, ventas, ajustes y transferencias.
Automatización: Actualización de stock al confirmar pagos o recibir compras.

Recursos Humanos

Empleados: Gestión de perfiles con enlaces opcionales a usuarios autenticados.
Asignaciones a Tiendas: Roles específicos por tienda (por ejemplo, Cajero, Gerente).
Turnos: Programación y seguimiento de turnos operativos.

Compras y Proveedores

Compras: Órdenes de compra con estados (Borrador, Ordenado, Recibido, Cancelado).
Proveedores: Gestión de contactos y RUC.
Ítems de Compra: Seguimiento de productos comprados.

Promociones

Reglas de Precios: Descuentos porcentuales o fijos por producto o categoría.
Gestión Flexible: Activación/desactivación con fechas específicas.

Auditoría y Notificaciones

Auditoría: Registro de acciones (CREAR, ACTUALIZAR, ELIMINAR) con datos de antes y después.
Notificaciones: Alertas para stock bajo, pagos recibidos o transacciones Yape pendientes.
Adjuntos: Carga de archivos (por ejemplo, comprobantes) vinculados a órdenes o compras.

Seguridad

RLS: Acceso restringido a datos según inquilino y rol.
Permisos Granulares: Control de operaciones CRUD por rol.

Arquitectura Técnica

Base de Datos: PostgreSQL con Supabase, usando extensiones pgcrypto y uuid-ossp.
Tipos de Datos: Enums personalizados para estados (por ejemplo, payment_status_enum).
Disparadores: Automatizan tareas como generación de códigos, actualización de inventario y conciliación.
Índices: Optimizados para consultas frecuentes (órdenes pendientes, transacciones Yape).
Vistas: Resúmenes útiles como órdenes con estado de pago y transacciones Yape no emparejadas.

Casos de Uso

Ventas en Tienda: Registro rápido de ventas con soporte para Yape, efectivo, tarjeta o transferencia.
Inventario: Seguimiento en tiempo real con alertas de reposición.
Conciliación de Pagos: Emparejamiento automático de transacciones Yape con revisión manual.
Recursos Humanos: Asignación de empleados y turnos.
Compras: Gestión de órdenes de compra con integración al inventario.

Beneficios

Eficiencia: Automatiza procesos clave como conciliación e inventario.
Escalabilidad: Soporta múltiples negocios en un solo sistema.
Flexibilidad: Planes y configuraciones adaptables.
Seguridad: RLS y auditoría para control y trazabilidad.

Datos Iniciales

Incluye datos de prueba: tenant demo, tienda principal, producto de ejemplo, plan Pro.
Configuración inicial para Yape y stock para implementación rápida.

Instalación

Requisitos:
PostgreSQL 13+ con Supabase.
Zona horaria configurada en America/Lima.


Pasos:# Clonar el repositorio
git clone <repository-url>
cd PymeYapePro
# Ejecutar el script SQL
psql -U postgres -d <database> -f schema.sql


Configuración:
Configurar variables de entorno en Supabase para autenticación y almacenamiento.
Asegurar que las extensiones pgcrypto y uuid-ossp estén habilitadas.



Contribución

Fork del repositorio.
Crear una rama (git checkout -b feature/nueva-funcionalidad).
Commitear cambios (git commit -m 'Añadir nueva funcionalidad').
Push a la rama (git push origin feature/nueva-funcionalidad).
Crear un Pull Request.

Licencia
Este proyecto está licenciado bajo la Licencia MIT.