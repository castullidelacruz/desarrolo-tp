export class HealthController {
  healthCheck(req, res) {
    res.send({ status: "OK" });
  }
}
