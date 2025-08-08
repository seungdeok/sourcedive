import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FAQ() {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">자주 묻는 질문</h2>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Source Dive의 데이터는 어디서 가져오나요?</AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-4">
                <p>현재 주요 패키지 정보는 npm registry와 github에서 가져옵니다.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">npm registry</Badge>
                  <Badge variant="secondary">github</Badge>
                </div>
                <p>패키지 정보는 실시간으로 업데이트되며, 최신 버전 정보와 의존성을 실시간으로 분석할 수 있습니다.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">분석할 수 있는 파일 형식은 무엇인가요?</AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-4">
                <p>분석할 수 있는 파일 형식은 다음과 같습니다.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm">JavaScript/Node.js</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1 text-sm">
                        <div>• *.ts, *.tsx, *.js, *.jsx, *.json, *.mjs, *.cjs</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-4">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        기타언어 <Badge variant="secondary">추후 제공</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0" />
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Source Dive는 무료로 사용할 수 있나요?</AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-4">
                <p>기본 서비스는 완전 무료로 제공됩니다.</p>
                <div className="space-y-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-900 flex items-center gap-2">✅ 무료 서비스</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-green-700">
                        <div>• 패키지 검색</div>
                        <div>• 파일 업로드 분석</div>
                        <div>• 의존성 트리 시각화</div>
                        <div>• 인기 트렌드 확인</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-blue-900 flex items-center gap-2">
                        💎 프리미엄 서비스 <Badge variant="secondary">추후 제공</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent />
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
