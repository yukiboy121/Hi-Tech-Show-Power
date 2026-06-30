// Keep the schema entrypoint present so models can define tables and run
// `npx drizzle-kit push` without bootstrapping Drizzle config first.
import { pgEnum, pgTable, serial, text, timestamp, varchar, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["admin", "user"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarUrl: text("avatar_url"),
  role: userRole("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: false }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  location: varchar("location", { length: 300 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const siteImages = pgTable("site_images", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  path: varchar("path", { length: 500 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  details: text("details"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const repairs = pgTable("repairs", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").references(() => sites.id, { onDelete: "set null" }),
  title: varchar("title", { length: 200 }).notNull(),
  details: text("details"),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  sites: many(sites),
  orders: many(orders),
  repairs: many(repairs),
}));

export const sitesRelations = relations(sites, ({ many }) => ({
  images: many(siteImages),
  repairs: many(repairs),
}));

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull().default("service_request"),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  link: varchar("link", { length: 255 }),
  read: boolean("read").notNull().default(false),
  orderId: integer("order_id"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: varchar("endpoint", { length: 500 }).notNull(),
  p256dh: varchar("p256dh", { length: 255 }).notNull(),
  auth: varchar("auth", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ }) => ({}));
export const repairsRelations = relations(repairs, ({ }) => ({}));
