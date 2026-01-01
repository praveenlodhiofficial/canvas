type Handler = (
  req: Request,
  params: Record<string, string>,
) => Promise<Response> | Response;

type Route = {
  path: string;
  segments: string[];
  handler: Handler;
};

export class Router {
  private routes: Record<string, Route[]> = {};

  // -------------------- REGISTER --------------------
  register(method: string, path: string, handler: Handler) {
    method = method.toUpperCase();
  
    let routes = this.routes[method];
    if (!routes) {
      routes = [];
      this.routes[method] = routes;
    }
  
    const segments = path.split("/").filter(Boolean);
  
    routes.push({
      path,
      segments,
      handler,
    });
  }
  

  // -------------------- METHODS --------------------
  get(path: string, handler: Handler) {
    this.register("GET", path, handler);
  }

  post(path: string, handler: Handler) {
    this.register("POST", path, handler);
  }

  put(path: string, handler: Handler) {
    this.register("PUT", path, handler);
  }

  delete(path: string, handler: Handler) {
    this.register("DELETE", path, handler);
  }

  // -------------------- HANDLE --------------------
  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method.toUpperCase();

    const routes = this.routes[method];
    if (!routes) {
      return new Response("Not Found", { status: 404 });
    }

    const reqSegments = pathname.split("/").filter(Boolean);

    for (const route of routes) {
      if (route.segments.length !== reqSegments.length) continue;

      const params: Record<string, string> = {};
      let matched = true;

      for (let i = 0; i < route.segments.length; i++) {
        const routeSeg = route.segments[i];
        const reqSeg = reqSegments[i];
      
        if (!routeSeg || !reqSeg) {
          matched = false;
          break;
        }
      
        if (routeSeg.startsWith(":")) {
          params[routeSeg.slice(1)] = reqSeg;
        } else if (routeSeg !== reqSeg) {
          matched = false;
          break;
        }
      }

      if (matched) {
        return route.handler(req, params);
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}
