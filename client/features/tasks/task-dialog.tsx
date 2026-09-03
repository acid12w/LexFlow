<Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Provide a name for your new file. Click create when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="filename">File Name</FieldLabel>
              <Input id="filename" name="filename" placeholder="document.txt" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent
          className={cn(
            "overflow-x-scroll h-[98%]",
            isExpanded === true ? "sm:max-w-[725px]" : "sm:max-w-[525px] "
          )}
        >
          <DialogHeader>
            <DialogTitle>Patrick Bob divorce</DialogTitle>
            <DialogDescription>
              Anyone with the link will be able to view this file.
            </DialogDescription>
            <div className="flex gap-x-4">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                size="icon"
                aria-label="Submit"
              >
                <Expand />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Submit"
                onClick={() => {
                  SetIsEditing(!idEditing);
                }}
              >
                <Pencil />
              </Button>
            </div>

            <Separator className="my-1" />
          </DialogHeader>
          <EditTaskForm isEditing={idEditing} />
          <div className="flex justify-between">
            <p className="text-gray-500">Attachments</p>
            <p className="text-blue-500">Download all</p>
          </div>
          <div className="flex gap-4 h-max ">
            <div className="flex items-center border-2 border-gray-200 p-2 w-max rounded-lg ">
              <PiMicrosoftExcelLogoFill className="size-12 text-green-600" />
              <p className="w-max">work sheet</p>
            </div>
            <div className="flex items-center border-2 border-gray-200 p-2 w-max rounded-lg">
              <BsFileEarmarkWordFill className="size-10 text-blue-600" />
              <p className="w-max">work sheet</p>
            </div>
            <div className="flex items-center border-2 border-gray-200 p-2 w-max rounded-lg">
              <BsFillFileEarmarkPdfFill className="size-10 text-red-600" />
              <p className="w-max">work sheet</p>
            </div>
          </div>

          <Button variant="outline" size="sm">
            Upload Files
          </Button>
          <ActionTab />
        </DialogContent>
      </Dialog>