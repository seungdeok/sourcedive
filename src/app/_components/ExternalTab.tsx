import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Info, Package, Terminal } from "lucide-react";
import Link from "next/link";

export default function ExternalTab() {
  return (
    <div className="space-y-6">
      <Alert className="border-gray-700 bg-gray-900 py-6 px-0">
        <Terminal className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-gray-100">
          <div className="">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-2">외부 파일 사용 가이드</p>
                <p className="text-sm">
                  외부 환경의 파일을 조회하려면 SourceDive CLI(Command Line Interface)를 사용해야 합니다.
                </p>
              </div>
            </div>

            <div className="ml-6 space-y-2">
              <div>
                <p className="font-medium text-sm mb-1">CLI 사용 가이드</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-400"># npm</div>
                    <div className="bg-gray-800 p-2 rounded-md text-sm">
                      {"npx sourcedive -o {outputDirectory} -f {entryFile}"}
                    </div>
                    <div className="text-gray-400 mt-2"># yarn</div>
                    <div className="bg-gray-800 p-2 rounded-md text-sm">
                      {"yarn dlx sourcedive -o {outputDirectory} -f {entryFile}"}
                    </div>
                    <div className="text-gray-400 mt-2"># pnpm</div>
                    <div className="bg-gray-800 p-2 rounded-md text-sm">
                      {"pnpm dlx sourcedive -o {outputDirectory} -f {entryFile}"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium text-sm mb-2">사용 예시</p>
                <div className="bg-gray-900 text-gray-100 pt-3 pl-3 pr-3 rounded-md font-mono text-sm space-y-1">
                  <div className="text-gray-400"># React 프로젝트의 특정 컴포넌트 분석</div>
                  <div className="bg-gray-800 p-2 rounded-md text-sm">
                    {"npx sourcedive -o {outputDirectory} -f src/components/Header.jsx"}
                  </div>
                  <div className="text-gray-400 mt-2"># Node.js 서버 파일 분석</div>
                  <div className="bg-gray-800 p-2 rounded-md text-sm">
                    {"npx sourcedive -o {outputDirectory} -f server/app.js"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg">
        <p className="font-medium mb-2">💡 팁</p>
        <ul className="space-y-1 ml-4">
          <li>• 대용량 파일은 CLI에서 처리하는 것이 더 효율적입니다</li>
          <li>• 배치 처리나 자동화가 필요한 경우 스크립트를 작성하세요</li>
          <li>• 민감한 데이터는 로컬에서 처리하여 보안을 유지하세요</li>
          <li>• 여러 파일을 동시에 분석할 때는 와일드카드(*)를 활용하세요</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="https://github.com/seungdeok/sourcedive" target="_blank">
          <Button
            className="cursor-pointer flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            type="button"
          >
            <Package size={18} />
            NPM 패키지
          </Button>
        </Link>

        <Link href="https://github.com/seungdeok/sourcedive/blob/main/packages/cli/README.md" target="_blank">
          <Button
            className="cursor-pointer flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            type="button"
          >
            <ExternalLink size={18} />
            문서 보기
          </Button>
        </Link>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-amber-800">
            <p className="font-medium text-sm mb-1">참고사항</p>
            <p className="text-sm">
              SourceDive CLI는 오픈소스 프로젝트입니다. 설치 및 사용 중 문제가 발생하면 GitHub Issues를 통해
              문의해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
