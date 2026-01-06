import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  Logger,
  buildLogger,
  iconLogger,
  imageLogger,
  perfLogger,
  routingLogger,
  themeLogger,
} from "../../utils/logger";

describe("Logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("shouldLog based on level", () => {
    it("should log error when level is debug", () => {
      const logger = new Logger({ enabled: true, level: "debug" });
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      logger.error("test message");

      expect(spy).toHaveBeenCalledWith("test message");
      spy.mockRestore();
    });

    it("should log warn when level is debug", () => {
      const logger = new Logger({ enabled: true, level: "debug" });
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

      logger.warn("test message");

      expect(spy).toHaveBeenCalledWith("test message");
      spy.mockRestore();
    });

    it("should log info when level is debug", () => {
      const logger = new Logger({ enabled: true, level: "debug" });
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});

      logger.info("test message");

      expect(spy).toHaveBeenCalledWith("test message");
      spy.mockRestore();
    });

    it("should log debug when level is debug", () => {
      const logger = new Logger({ enabled: true, level: "debug" });
      const spy = vi.spyOn(console, "debug").mockImplementation(() => {});

      logger.debug("test message");

      expect(spy).toHaveBeenCalledWith("test message");
      spy.mockRestore();
    });

    it("should not log debug when level is info", () => {
      const logger = new Logger({ enabled: true, level: "info" });
      const spy = vi.spyOn(console, "debug").mockImplementation(() => {});

      logger.debug("test message");

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("should not log info when level is warn", () => {
      const logger = new Logger({ enabled: true, level: "warn" });
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});

      logger.info("test message");

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("should not log warn when level is error", () => {
      const logger = new Logger({ enabled: true, level: "error" });
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

      logger.warn("test message");

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("enabled/disabled state", () => {
    it("should not log when disabled", () => {
      const logger = new Logger({ enabled: false, level: "debug" });
      const spy = vi.spyOn(console, "debug").mockImplementation(() => {});

      logger.debug("test message");

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("should log when enabled", () => {
      const logger = new Logger({ enabled: true, level: "debug" });
      const spy = vi.spyOn(console, "debug").mockImplementation(() => {});

      logger.debug("test message");

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("prefix formatting", () => {
    it("should add prefix to messages", () => {
      const logger = new Logger({ enabled: true, level: "info", prefix: "Test" });
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});

      logger.info("message");

      expect(spy).toHaveBeenCalledWith("[Test] message");
      spy.mockRestore();
    });

    it("should not add prefix when not configured", () => {
      const logger = new Logger({ enabled: true, level: "info" });
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});

      logger.info("message");

      expect(spy).toHaveBeenCalledWith("message");
      spy.mockRestore();
    });
  });

  describe("additional arguments", () => {
    it("should pass additional arguments to console", () => {
      const logger = new Logger({ enabled: true, level: "info" });
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});

      logger.info("message", { key: "value" }, 123, true);

      expect(spy).toHaveBeenCalledWith("message", { key: "value" }, 123, true);
      spy.mockRestore();
    });
  });

  describe("child logger", () => {
    it("should create child logger with extended prefix", () => {
      const parentLogger = new Logger({ enabled: true, level: "info", prefix: "Parent" });
      const childLogger = parentLogger.child("Child");
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});

      childLogger.info("message");

      expect(spy).toHaveBeenCalledWith("[Parent:Child] message");
      spy.mockRestore();
    });

    it("should create child logger when parent has no prefix", () => {
      const parentLogger = new Logger({ enabled: true, level: "info" });
      const childLogger = parentLogger.child("Child");
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});

      childLogger.info("message");

      expect(spy).toHaveBeenCalledWith("[Child] message");
      spy.mockRestore();
    });
  });

  describe("specialized loggers", () => {
    it("should export routingLogger", () => {
      expect(routingLogger).toBeInstanceOf(Logger);
    });

    it("should export imageLogger", () => {
      expect(imageLogger).toBeInstanceOf(Logger);
    });

    it("should export perfLogger", () => {
      expect(perfLogger).toBeInstanceOf(Logger);
    });

    it("should export buildLogger", () => {
      expect(buildLogger).toBeInstanceOf(Logger);
    });

    it("should export iconLogger", () => {
      expect(iconLogger).toBeInstanceOf(Logger);
    });

    it("should export themeLogger", () => {
      expect(themeLogger).toBeInstanceOf(Logger);
    });
  });
});
